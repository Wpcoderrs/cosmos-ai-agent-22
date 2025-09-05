
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useDevSettings } from '@/hooks/useDevSettings';
import { useWebhook } from '@/hooks/useWebhook';

const MediaInputs: React.FC = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [researchLink, setResearchLink] = useState('');
  const [isSubmittingYoutube, setIsSubmittingYoutube] = useState(false);
  const [isSubmittingResearch, setIsSubmittingResearch] = useState(false);
  const { toast } = useToast();
  const { settings } = useDevSettings();
  const { triggerYoutubeWebhook, triggerNewsWebhook } = useWebhook();

  const handleYoutubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!youtubeUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmittingYoutube(true);
    
    try {
      // Get the current user ID if authenticated
      let userId = "00000000-0000-0000-0000-000000000000"; // Default dev ID
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id) {
          userId = user.id;
        }
      } catch (error) {
        console.warn("Auth error:", error);
      }
      
      // Create payload for the webhook
      const payload = {
        youtubeUrl,
        timestamp: new Date().toISOString()
      };
      
      // Trigger the webhook
      const success = await triggerYoutubeWebhook(userId, payload);
      
      if (!success) {
        throw new Error("Webhook trigger failed");
      }
      
      toast({
        title: "YouTube URL Submitted",
        description: "Your YouTube URL has been sent for processing"
      });
      
      setYoutubeUrl('');
    } catch (error) {
      console.error("Error submitting YouTube URL:", error);
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your YouTube URL",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingYoutube(false);
    }
  };
  
  const handleResearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!researchLink.trim()) {
      toast({
        title: "Error",
        description: "Please enter a research link",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmittingResearch(true);
    
    try {
      // Get the current user ID if authenticated
      let userId = "00000000-0000-0000-0000-000000000000"; // Default dev ID
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id) {
          userId = user.id;
        }
      } catch (error) {
        console.warn("Auth error:", error);
      }
      
      // Create payload for the webhook
      const payload = {
        newsQuery: researchLink, // Keep the backend field name the same
        timestamp: new Date().toISOString()
      };
      
      // Trigger the webhook
      const success = await triggerNewsWebhook(userId, payload);
      
      if (!success) {
        throw new Error("Webhook trigger failed");
      }
      
      toast({
        title: "Research Link Submitted",
        description: "Your research link has been sent for processing"
      });
      
      setResearchLink('');
    } catch (error) {
      console.error("Error submitting research link:", error);
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your research link",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingResearch(false);
    }
  };

  return (
    <div className="space-y-3 w-full">
      {/* YouTube URL input */}
      <div className="bg-[#102a43]/70 rounded-lg p-3 border border-[#33C3F0]/40">
        <h3 className="text-md mb-1.5 font-space-grotesk text-[#33C3F0]">YouTube URL</h3>
        <form onSubmit={handleYoutubeSubmit} className="flex gap-2">
          <Input
            type="url"
            placeholder="Enter YouTube URL"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="bg-[#0f2231] border-[#33C3F0]/30 text-white font-inter flex-1 h-9"
          />
          <Button
            type="submit"
            className="bg-[#33C3F0] hover:bg-[#0EA5E9] text-black font-space-grotesk min-w-[80px] h-9 text-sm"
            disabled={isSubmittingYoutube}
          >
            {isSubmittingYoutube ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
      
      {/* Research Link input */}
      <div className="bg-[#102a43]/70 rounded-lg p-3 border border-[#33C3F0]/40">
        <h3 className="text-md mb-1.5 font-space-grotesk text-[#33C3F0]">Research Link</h3>
        <form onSubmit={handleResearchSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter research link or topic"
            value={researchLink}
            onChange={(e) => setResearchLink(e.target.value)}
            className="bg-[#0f2231] border-[#33C3F0]/30 text-white font-inter flex-1 h-9"
          />
          <Button
            type="submit"
            className="bg-[#33C3F0] hover:bg-[#0EA5E9] text-black font-space-grotesk min-w-[80px] h-9 text-sm"
            disabled={isSubmittingResearch}
          >
            {isSubmittingResearch ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MediaInputs;
