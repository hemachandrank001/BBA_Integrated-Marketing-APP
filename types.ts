export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface AnalyticsData {
  concept: string;
  level: string;
  useCase: string;
  outcome: string;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  isThinking?: boolean;
  analytics?: AnalyticsData;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
