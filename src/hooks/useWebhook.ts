
import { supabase } from '@/integrations/supabase/client';

interface WebhookPayload {
  storagePath: string;
  originalFilename: string;
  downloadUrl?: string | null;
}

interface YoutubePayload {
  youtubeUrl: string;
  timestamp: string;
}

interface NewsPayload {
  newsQuery: string;
  timestamp: string;
}

export const useWebhook = () => {
  // Trigger webhook for file processing
  const triggerFileProcessingWebhook = async (userId: string, payload: WebhookPayload): Promise<boolean> => {
    try {
      // Get the user's webhook URL
      const { data: userData, error: userError } = await supabase
        .from('user_settings')
        .select('file_processing_webhook')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (userError || !userData?.file_processing_webhook) {
        if (userError) {
          console.error("Error retrieving webhook URL:", userError);
        }
        return false;
      }
      
      // Always ensure downloadUrl is present and valid
      const publicUrl = payload.downloadUrl || 
        supabase.storage.from('file_uploads').getPublicUrl(payload.storagePath).data?.publicUrl;
      
      const enhancedPayload = {
        ...payload,
        downloadUrl: publicUrl
      };
      
      console.log("Sending webhook payload with URL:", enhancedPayload.downloadUrl);
      
      // Trigger the webhook
      const response = await fetch(userData.file_processing_webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(enhancedPayload)
      });
      
      if (!response.ok) {
        console.error("Webhook trigger failed:", await response.text());
        return false;
      }
      
      console.log("Webhook triggered successfully");
      
      // Notify the application about the webhook trigger
      document.dispatchEvent(new CustomEvent('webhook:triggered', {
        detail: { type: 'file', payload: enhancedPayload }
      }));
      
      return true;
    } catch (webhookError) {
      console.error("Webhook error:", webhookError);
      return false;
    }
  };

  // Trigger webhook for YouTube processing
  const triggerYoutubeWebhook = async (userId: string, payload: YoutubePayload): Promise<boolean> => {
    try {
      // Get the user's webhook URL - FIXED: Using youtube_webhook instead of file_processing_webhook
      const { data: userData, error: userError } = await supabase
        .from('user_settings')
        .select('youtube_webhook')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (userError || !userData?.youtube_webhook) {
        if (userError) {
          console.error("Error retrieving YouTube webhook URL:", userError);
        }
        return false;
      }
      
      console.log("Using YouTube webhook URL:", userData.youtube_webhook);
      
      // Trigger the webhook
      const response = await fetch(userData.youtube_webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        console.error("YouTube webhook trigger failed:", await response.text());
        return false;
      }
      
      console.log("YouTube webhook triggered successfully");
      
      // Notify the application about the webhook trigger
      document.dispatchEvent(new CustomEvent('webhook:triggered', {
        detail: { type: 'youtube', payload }
      }));
      
      return true;
    } catch (webhookError) {
      console.error("YouTube webhook error:", webhookError);
      return false;
    }
  };

  // Trigger webhook for News processing
  const triggerNewsWebhook = async (userId: string, payload: NewsPayload): Promise<boolean> => {
    try {
      // Get the user's webhook URL
      const { data: userData, error: userError } = await supabase
        .from('user_settings')
        .select('news_webhook')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (userError || !userData?.news_webhook) {
        if (userError) {
          console.error("Error retrieving News webhook URL:", userError);
        }
        return false;
      }
      
      // Trigger the webhook
      const response = await fetch(userData.news_webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        console.error("News webhook trigger failed:", await response.text());
        return false;
      }
      
      console.log("News webhook triggered successfully");
      
      // Notify the application about the webhook trigger
      document.dispatchEvent(new CustomEvent('webhook:triggered', {
        detail: { type: 'news', payload }
      }));
      
      return true;
    } catch (webhookError) {
      console.error("News webhook error:", webhookError);
      return false;
    }
  };

  // Record file in processing queue
  const recordFileInQueue = async (userId: string, filePath: string, fileName: string): Promise<boolean> => {
    try {
      const { error: insertError } = await (supabase as any)
        .from('file_processing_queue')
        .insert({
          user_id: userId,
          storage_path: filePath,
          original_filename: fileName
        });
        
      if (insertError) {
        console.error("Error recording file in database:", insertError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error recording file in processing queue:", error);
      return false;
    }
  };

  return {
    triggerFileProcessingWebhook,
    triggerYoutubeWebhook,
    triggerNewsWebhook,
    recordFileInQueue
  };
};
