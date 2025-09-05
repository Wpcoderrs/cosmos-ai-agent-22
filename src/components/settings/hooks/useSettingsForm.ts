
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from '@/integrations/supabase/client';
import { useDevSettings } from '@/hooks/useDevSettings';

export const settingsSchema = z.object({
  fileProcessingWebhook: z.string().url("Please enter a valid URL").or(z.string().length(0, "URL must be empty or valid")),
  chatRagWebhook: z.string().url("Please enter a valid URL").or(z.string().length(0, "URL must be empty or valid")),
  youtubeWebhook: z.string().url("Please enter a valid URL").or(z.string().length(0, "URL must be empty or valid")),
  newsWebhook: z.string().url("Please enter a valid URL").or(z.string().length(0, "URL must be empty or valid"))
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export const useSettingsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { settings: devSettings, saveSettings: saveDevSettings } = useDevSettings();
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      fileProcessingWebhook: "",
      chatRagWebhook: "",
      youtubeWebhook: "",
      newsWebhook: ""
    }
  });

  // Load user settings from Supabase or localStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // For development - use a default user ID if not authenticated
        let userId;
        
        try {
          const user = supabase.auth.getUser();
          userId = (await user).data.user?.id;
        } catch (authError) {
          console.warn("Auth error:", authError);
        }
        
        // For development - use a default user ID if not authenticated
        if (!userId) {
          // Use a development user ID for testing
          userId = "00000000-0000-0000-0000-000000000000";
          console.info("Using development user ID for settings:", userId);
          setIsDevelopmentMode(true);
          
          // If we have dev settings in localStorage, use those
          if (devSettings) {
            form.reset({
              fileProcessingWebhook: devSettings.fileProcessingWebhook || "",
              chatRagWebhook: devSettings.chatRagWebhook || "",
              youtubeWebhook: devSettings.youtubeWebhook || "",
              newsWebhook: devSettings.newsWebhook || ""
            });
            return;
          }
        }
        
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('user_settings')
          .select('file_processing_webhook, chat_rag_webhook, youtube_webhook, news_webhook')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (error) {
          console.error("Error loading settings:", error);
          return;
        }
        
        if (data) {
          form.reset({
            fileProcessingWebhook: data.file_processing_webhook || "",
            chatRagWebhook: data.chat_rag_webhook || "",
            youtubeWebhook: data.youtube_webhook || "",
            newsWebhook: data.news_webhook || ""
          });
        }
      } catch (err) {
        console.error("Error getting user settings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [form, devSettings]);
  
  // Save settings to Supabase or localStorage
  const onSubmit = async (values: SettingsFormValues) => {
    try {
      setIsLoading(true);
      
      // For development - use a default user ID if not authenticated
      let userId;
      
      try {
        const user = supabase.auth.getUser();
        userId = (await user).data.user?.id;
      } catch (authError) {
        console.warn("Auth error:", authError);
      }
      
      // For development - use localStorage instead of Supabase
      if (!userId) {
        // Use a development user ID for testing
        userId = "00000000-0000-0000-0000-000000000000";
        console.info("Using localStorage for development settings");
        
        const saveResult = saveDevSettings({
          fileProcessingWebhook: values.fileProcessingWebhook,
          chatRagWebhook: values.chatRagWebhook,
          youtubeWebhook: values.youtubeWebhook,
          newsWebhook: values.newsWebhook
        });
        
        if (!saveResult.success) {
          throw new Error("Failed to save development settings");
        }
        
        toast({
          title: "Development Settings Saved",
          description: "Your webhook settings have been saved to localStorage."
        });
        
        return;
      }
      
      // Check if settings already exist
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
        
      let result;
      
      if (existingSettings) {
        // Update existing settings
        result = await supabase
          .from('user_settings')
          .update({
            file_processing_webhook: values.fileProcessingWebhook || null,
            chat_rag_webhook: values.chatRagWebhook || null,
            youtube_webhook: values.youtubeWebhook || null,
            news_webhook: values.newsWebhook || null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        // Create new settings
        result = await supabase
          .from('user_settings')
          .insert({
            user_id: userId,
            file_processing_webhook: values.fileProcessingWebhook || null,
            chat_rag_webhook: values.chatRagWebhook || null,
            youtube_webhook: values.youtubeWebhook || null,
            news_webhook: values.newsWebhook || null
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: "Settings Saved",
        description: "Your webhook settings have been updated successfully."
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      
      toast({
        title: "Error Saving Settings",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
    isDevelopmentMode
  };
};
