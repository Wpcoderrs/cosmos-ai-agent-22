
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useDevSettings } from '@/hooks/useDevSettings';

export interface ChatType {
  id: string;
  name: string;
  type: string; // Properly defined type field
  webhook_url: string | null;
  is_default: boolean;
}

export const useChatTypes = () => {
  const [chatTypes, setChatTypes] = useState<ChatType[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { settings: devSettings } = useDevSettings();
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);

  useEffect(() => {
    const loadChatTypes = async () => {
      try {
        // Get user ID
        let userId;
        try {
          const user = supabase.auth.getUser();
          userId = (await user).data.user?.id;
        } catch (authError) {
          console.warn("Auth error:", authError);
        }

        if (!userId) {
          // Use development mode
          userId = "00000000-0000-0000-0000-000000000000";
          setIsDevelopmentMode(true);
          
          // Create mock chat types for development
          const mockTypes: ChatType[] = [
            { id: '1', name: 'Personal Business', type: 'personal_business', webhook_url: devSettings?.chatRagWebhook || null, is_default: true },
            { id: '2', name: 'AI', type: 'ai', webhook_url: devSettings?.chatRagWebhook || null, is_default: false }
          ];
          
          setChatTypes(mockTypes);
          setSelectedTypeId(mockTypes.find(type => type.is_default)?.id || mockTypes[0]?.id || null);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        
        // Fetch chat types from database - now properly selecting the type field
        const { data, error } = await supabase
          .from('chat_types')
          .select('*')
          .eq('user_id', userId)
          .order('name');
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          setChatTypes(data as ChatType[]); // Cast to ensure type safety
          
          // Set the default type, or the first one if no default
          const defaultType = data.find(type => type.is_default);
          setSelectedTypeId(defaultType?.id || data[0].id);
        } else {
          console.log("No chat types found for user");
        }
      } catch (err) {
        console.error("Error loading chat types:", err);
        toast({
          title: "Error Loading Chat Types",
          description: "Could not load your chat types. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadChatTypes();
  }, [devSettings]);

  const getSelectedType = (): ChatType | null => {
    if (!selectedTypeId) return null;
    return chatTypes.find(type => type.id === selectedTypeId) || null;
  };

  return {
    chatTypes,
    selectedTypeId,
    setSelectedTypeId,
    isLoading,
    isDevelopmentMode,
    getSelectedType
  };
};
