// Temporary types until auto-generated types update
export interface UserSettings {
  id: string;
  user_id: string;
  file_processing_webhook?: string;
  chat_rag_webhook?: string;
  youtube_webhook?: string;
  news_webhook?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatType {
  id: string;
  user_id: string;
  name: string;
  type: string;
  webhook_url?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Manual database interface until types regenerate
export interface ManualDatabase {
  public: {
    Tables: {
      user_settings: {
        Row: UserSettings;
        Insert: Omit<UserSettings, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<UserSettings, 'id' | 'created_at'>> & {
          updated_at?: string;
        };
      };
      chat_types: {
        Row: ChatType;
        Insert: Omit<ChatType, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ChatType, 'id' | 'created_at'>> & {
          updated_at?: string;
        };
      };
    };
  };
}