import React, { useState, useRef, useEffect } from 'react';
import { initializeChat, sendMessageToGemini } from './services/geminiService';
import Sidebar from './components/Sidebar';
import MessageBubble from './components/MessageBubble';
import AudioRecorder from './components/AudioRecorder';
import { Message, Role } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      text: "Hello. I am Euonia, your Teaching Assistant for Prof. Michael in Integrated Marketing Communications. How can I help you understand the course fundamentals today?"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeChat();
      } catch (e) {
        console.error("Failed to init chat", e);
      }
    };
    init();
  }, []);

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleStartRecording = () => {
    stopSpeaking();
    setInputText(''); // Clear input box when starting to record
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      stopSpeaking();
      
      const cleanText = text
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/\[\[.*?\]\]/g, '');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voices = window.speechSynthesis.getVoices();
      
      // Strict priority for "Samantha", then fallback to other female-sounding voices
      const preferredVoice = voices.find(v => v.name === 'Samantha') || 
                             voices.find(v => v.name.includes('Google US English')) ||
                             voices.find(v => v.name.toLowerCase().includes('female')) ||
                             voices[0];

      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Updated handler to accept transcript
  const handleSendMessage = async (text: string | null, audioBase64?: string, mimeType?: string, transcript?: string) => {
    if ((!text && !audioBase64) || isLoading) return;
    
    stopSpeaking();

    // Prioritize displaying the transcript if available, otherwise text, otherwise generic audio placeholder
    // We trim() to ensure we don't display empty whitespace
    const displayText = transcript?.trim() || text || "🎤 [Audio Message]";

    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: displayText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // We still send the audioBase64 to Gemini for the most accurate understanding
      // (as it handles tone/intent better than browser STT), but we use the transcript for UI.
      const response = await sendMessageToGemini(text, audioBase64, mimeType);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: response.text,
        analytics: response.analytics
      };

      setMessages(prev => [...prev, aiMsg]);

      if (audioBase64) {
        speakText(response.text);
      }

      if (response.analytics) {
        console.groupCollapsed(`Euonia Analytics Log [${new Date().toLocaleTimeString()}]`);
        console.log("Concept:", response.analytics.concept);
        console.log("Level:", response.analytics.level);
        console.log("Use Case:", response.analytics.useCase);
        console.log("Outcome:", response.analytics.outcome);
        console.groupEnd();
      }

    } catch (error: any) {
      console.error("Chat Error:", error);
      let errorMessage = "I apologize, but I encountered an error connecting to the service. Please try again.";
      
      // Display detailed error if available (helpful for debugging API Key issues)
      if (error.message && (error.message.includes("API_KEY") || error.message.includes("400") || error.message.includes("403"))) {
         errorMessage += ` (System Error: ${error.message})`;
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: Role.MODEL,
        text: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (question: string) => {
    stopSpeaking();
    handleSendMessage(question);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar 
        onSuggestionClick={handleSuggestionClick} 
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <span className="font-semibold text-slate-800">Euonia TA</span>
          <button onClick={toggleSidebar} className="text-slate-600 hover:text-blue-600 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
          <div className="max-w-3xl mx-auto">
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
               <div className="flex justify-start mb-6 w-full animate-pulse">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-6 py-4 shadow-sm flex items-center gap-2">
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-slate-200 p-4 pb-6 md:p-6">
          <div className="max-w-3xl mx-auto relative flex gap-3 items-end">
            <div className="relative flex-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    stopSpeaking();
                    handleSendMessage(inputText);
                  }
                }}
                onFocus={() => stopSpeaking()}
                placeholder="Ask about IMC concepts..."
                className="w-full bg-slate-50 text-slate-900 rounded-xl border border-slate-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none shadow-sm text-sm md:text-base"
                rows={1}
                style={{ minHeight: '52px', maxHeight: '120px' }}
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={isLoading || !inputText.trim()}
                className="absolute right-2 top-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            
            <div className="pb-1">
              <AudioRecorder 
                onAudioRecorded={(base64, mimeType, transcript) => handleSendMessage(null, base64, mimeType, transcript)} 
                onStartRecording={handleStartRecording}
                onTranscriptChange={(text) => setInputText(text)}
                disabled={isLoading}
              />
            </div>

          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            Euonia acts as a pedagogical guide restricted to IMC course content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;