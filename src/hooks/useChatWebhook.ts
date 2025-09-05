
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
  chatTypeId: string | null;
}

export const useChatWebhook = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: uuidv4(),
      title: 'New Conversation',
      messages: [
        {
          id: '1',
          content: "I'm here to assist you. Just tell me what you need and I'll get it done.",
          sender: 'system',
          timestamp: new Date()
        }
      ],
      lastUpdated: new Date(),
      chatTypeId: null
    }
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string>(conversations[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const getActiveConversation = () => {
    return conversations.find(conv => conv.id === activeConversationId) || conversations[0];
  };
  
  const messages = getActiveConversation().messages;

  const createNewConversation = (chatTypeId: string | null = null) => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: 'New Conversation',
      messages: [
        {
          id: '1',
          content: "I'm here to assist you. Just tell me what you need and I'll get it done.",
          sender: 'system',
          timestamp: new Date()
        }
      ],
      lastUpdated: new Date(),
      chatTypeId
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    
    return newConversation;
  };
  
  const switchConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };
  
  const updateConversationTitle = (id: string, firstUserMessage: string) => {
    // Generate a title based on the first message
    let title = firstUserMessage.slice(0, 20);
    if (firstUserMessage.length > 20) title += '...';
    
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id 
          ? { ...conv, title } 
          : conv
      )
    );
  };
  
  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    // If we're deleting the active conversation, switch to the first available one
    if (id === activeConversationId) {
      const remaining = conversations.filter(conv => conv.id !== id);
      if (remaining.length > 0) {
        setActiveConversationId(remaining[0].id);
      } else {
        // If no conversations left, create a new one
        createNewConversation();
      }
    }
  };

  const sendMessageToWebhook = async (message: string, typeId: string | null = null) => {
    try {
      const user = supabase.auth.getUser();
      const userId = (await user).data.user?.id;
      
      if (!userId) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue.",
          variant: "destructive"
        });
        return false;
      }
      
      // First try to get webhook URL from chat_types if typeId is provided
      let webhookUrl = null;
      let typeValue = null;
      
      if (typeId) {
        console.log("Getting webhook URL and type for typeId:", typeId);
        
        const { data: typeData, error: typeError } = await supabase
          .from('chat_types')
          .select('webhook_url, name, type')
          .eq('id', typeId)
          .maybeSingle();
        
        console.log("Type data from database:", typeData);
        console.log("Type error:", typeError);
        
        if (!typeError && typeData) {
          if (typeData.webhook_url) {
            webhookUrl = typeData.webhook_url;
          }
          
          // Explicitly use the type field if available, otherwise fall back to name
          typeValue = typeData.type || typeData.name.toLowerCase().replace(/\s+/g, '_');
          console.log(`Using chat type: '${typeData.name}' with type value '${typeValue}'`);
        }
      }
      
      // If no webhook URL from chat type, fall back to the default from user_settings
      if (!webhookUrl) {
        const { data: userData, error: userError } = await supabase
          .from('user_settings')
          .select('chat_rag_webhook')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (userError || !userData?.chat_rag_webhook) {
          toast({
            title: "Webhook Not Configured",
            description: "Please set up your Chat RAG Webhook URL in settings.",
            variant: "destructive"
          });
          return false;
        }
        
        webhookUrl = userData.chat_rag_webhook;
        console.log("Using default webhook URL from user settings:", webhookUrl);
      }
      
      setIsLoading(true);
      
      // Build the payload with type information if available
      const payload: any = { query: message };
      
      // CRITICAL FIX: Ensure type is always included if available
      if (typeValue) {
        payload.type = typeValue;
        console.log("Including type in payload:", typeValue);
      } else {
        console.log("No type value available to include in payload");
      }
      
      console.log("Final webhook payload:", payload);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`Webhook responded with status: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      let finalAnswer = responseText;
      
      // Try to parse as JSON first, if it's JSON, extract the answer
      try {
        if (responseText && responseText.trim()) {
          const parsedResponse = JSON.parse(responseText);
          
          // Extract the answer from the JSON response
          finalAnswer = parsedResponse?.output || 
                        parsedResponse?.answer || 
                        parsedResponse?.response || 
                        parsedResponse?.result || 
                        parsedResponse?.message || 
                        responseText;
        }
      } catch (parseError) {
        // If it's not valid JSON, use the raw text response
        console.log("Not JSON format, using raw text response");
        finalAnswer = responseText;
      }
      
      const systemMessage: Message = {
        id: crypto.randomUUID(),
        content: finalAnswer,
        sender: 'system',
        timestamp: new Date()
      };
      
      // Add the message to the active conversation
      setConversations(prev => 
        prev.map(conv => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, systemMessage],
              lastUpdated: new Date()
            };
          }
          return conv;
        })
      );
      
      setIsLoading(false);
      
      return true;
    } catch (error) {
      console.error("Error sending message to webhook:", error);
      
      setIsLoading(false);
      
      toast({
        title: "AI Assistant Unavailable",
        description: "There was an error processing your request. Please try again later.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const addUserMessage = (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Update the active conversation with the new message
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === activeConversationId) {
          // If this is the first user message, update the title
          if (conv.messages.filter(m => m.sender === 'user').length === 0) {
            setTimeout(() => {
              updateConversationTitle(conv.id, content);
            }, 100);
          }
          
          return {
            ...conv,
            messages: [...conv.messages, userMessage],
            lastUpdated: new Date()
          };
        }
        return conv;
      })
    );
  };

  return {
    messages,
    conversations,
    activeConversationId,
    isLoading,
    sendMessageToWebhook,
    addUserMessage,
    createNewConversation,
    switchConversation,
    deleteConversation
  };
};
