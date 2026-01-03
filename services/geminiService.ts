import { GoogleGenAI, Chat, GenerateContentResponse, Part } from "@google/genai";
import { EUONIA_SYSTEM_INSTRUCTION } from '../constants';
import { AnalyticsData } from '../types';

let chatSession: Chat | null = null;

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = async (): Promise<Chat> => {
  const ai = getClient();
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: EUONIA_SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
  return chatSession;
};

export const sendMessageToGemini = async (text: string | null, audioBase64?: string, mimeType: string = 'audio/wav'): Promise<{ text: string; analytics?: AnalyticsData }> => {
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) {
     throw new Error("Failed to initialize chat session.");
  }

  try {
    let messageContent: string | Part[];

    if (audioBase64) {
      // Multimodal input: Audio + Text (optional)
      messageContent = [
        {
          inlineData: {
            data: audioBase64,
            mimeType: mimeType
          }
        }
      ];
      if (text) {
        messageContent.push({ text });
      }
    } else {
      // Text only
      messageContent = text || "";
    }

    const response: GenerateContentResponse = await chatSession.sendMessage({ message: messageContent });
    const rawText = response.text || "";

    // Parse analytics tag
    const analyticsRegex = /\[\[ANALYTICS:\s*({.*?})\]\]/;
    const match = rawText.match(analyticsRegex);

    let cleanText = rawText;
    let analyticsData: AnalyticsData | undefined = undefined;

    if (match && match[1]) {
      try {
        analyticsData = JSON.parse(match[1]);
        // Remove the tag from the text shown to user
        cleanText = rawText.replace(analyticsRegex, '').trim();
      } catch (e) {
        console.warn("Failed to parse analytics JSON", e);
      }
    }

    return { text: cleanText, analytics: analyticsData };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
