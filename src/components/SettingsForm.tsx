
import React, { useState, useEffect } from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from '@/integrations/supabase/client';

const settingsSchema = z.object({
  fileProcessingWebhook: z.string().url("Please enter a valid URL").or(z.string().length(0, "URL must be empty or valid")),
  chatRagWebhook: z.string().url("Please enter a valid URL").or(z.string().length(0, "URL must be empty or valid"))
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const SettingsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      fileProcessingWebhook: "",
      chatRagWebhook: ""
    }
  });
  
  // Load user settings from Supabase
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
        }
        
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('user_settings')
          .select('file_processing_webhook, chat_rag_webhook')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (error) {
          console.error("Error loading settings:", error);
          return;
        }
        
        if (data) {
          form.reset({
            fileProcessingWebhook: data.file_processing_webhook || "",
            chatRagWebhook: data.chat_rag_webhook || ""
          });
        }
      } catch (err) {
        console.error("Error getting user settings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [form]);
  
  // Save settings to Supabase
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
      
      // For development - use a default user ID if not authenticated
      if (!userId) {
        // Use a development user ID for testing
        userId = "00000000-0000-0000-0000-000000000000";
        console.info("Using development user ID for saving settings:", userId);
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
            chat_rag_webhook: values.chatRagWebhook || null
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
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-orbitron title-section mb-2">VESSEL CONFIGURATION</h2>
        <p className="text-sm text-gray-300 font-exo">Adjust Your Settings</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fileProcessingWebhook"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-thanos-gold">File Processing Webhook URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://your-webhook-url.com" 
                    {...field} 
                    className="bg-thanos-cosmic-light border-thanos-purple"
                  />
                </FormControl>
                <FormDescription className="text-gray-400">
                  Webhook triggered after a file is uploaded to process the file.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="chatRagWebhook"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-thanos-gold">Chat RAG Webhook URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://your-webhook-url.com" 
                    {...field} 
                    className="bg-thanos-cosmic-light border-thanos-purple"
                  />
                </FormControl>
                <FormDescription className="text-gray-400">
                  Webhook triggered when sending messages to the Chat interface.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-thanos-gold hover:bg-thanos-gold/80 text-black"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SettingsForm;
