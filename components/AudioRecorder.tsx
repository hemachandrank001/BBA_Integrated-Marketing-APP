import React, { useState, useRef } from 'react';

interface AudioRecorderProps {
  onAudioRecorded: (base64Audio: string, mimeType: string, transcript: string) => void;
  onStartRecording: () => void;
  onTranscriptChange?: (text: string) => void;
  disabled: boolean;
}

// Add type definition for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioRecorded, onStartRecording, onTranscriptChange, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");
  const interimTranscriptRef = useRef<string>("");

  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg',
      'audio/aac'
    ];
    return types.find(type => MediaRecorder.isTypeSupported(type));
  };

  const startRecording = async () => {
    onStartRecording();
    transcriptRef.current = "";
    interimTranscriptRef.current = "";
    if (onTranscriptChange) onTranscriptChange("");

    try {
      // 1. Start Audio Recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : undefined;
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const finalMimeType = mediaRecorder.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: finalMimeType });
        
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const result = reader.result as string;
          if (result) {
            const base64String = result.split(',')[1];
            
            // Add a robust delay to allow the SpeechRecognition API to finalize the last sentence.
            setTimeout(() => {
              const final = transcriptRef.current;
              const interim = interimTranscriptRef.current;
              // Combine final and any remaining interim text
              const fullTranscript = [final, interim]
                .filter(Boolean)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();

              console.log("Final Transcript captured:", fullTranscript);

              onAudioRecorded(base64String, finalMimeType, fullTranscript);
            }, 800);
          }
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();

      // 2. Start Speech Recognition (for UI display only)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interim = '';
          let finalChunk = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalChunk += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }

          if (finalChunk) {
            transcriptRef.current += (transcriptRef.current ? " " : "") + finalChunk;
          }
          interimTranscriptRef.current = interim;

          // Notify parent of the current live text
          if (onTranscriptChange) {
             const currentFull = [transcriptRef.current, interimTranscriptRef.current]
                .filter(Boolean)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();
             onTranscriptChange(currentFull);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error", event.error);
        };

        recognitionRef.current = recognition;
        recognition.start();
      }

      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please allow permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled}
      className={`p-2 rounded-full transition-all duration-200 flex items-center justify-center w-10 h-10 ${
        isRecording 
          ? 'bg-red-500 text-white animate-pulse shadow-lg ring-4 ring-red-200' 
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-blue-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isRecording ? "Stop Recording" : "Speak"}
    >
      {isRecording ? (
        <div className="w-3 h-3 bg-white rounded-sm" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      )}
    </button>
  );
};

export default AudioRecorder;