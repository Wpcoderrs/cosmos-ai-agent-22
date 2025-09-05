
import React from 'react';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import WebhookField from './WebhookField';
import { useSettingsForm } from './hooks/useSettingsForm';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';
import ChatTypeSettings from './ChatTypeSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SettingsForm: React.FC = () => {
  const { form, isLoading, onSubmit, isDevelopmentMode } = useSettingsForm();
  
  return (
    <div className="space-y-4">
      {isDevelopmentMode && (
        <Alert className="bg-amber-500/20 border-amber-500 text-amber-500 text-sm">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Development mode: Settings stored in browser localStorage.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="webhooks" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#0c1f31]">
          <TabsTrigger value="webhooks" className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-black text-sm font-space-grotesk">
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="chat-types" className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-black text-sm font-space-grotesk">
            Chat Types
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="webhooks" className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <WebhookField
                form={form}
                name="fileProcessingWebhook"
                label="File Processing Webhook"
                description="Triggered after file upload to process the document."
              />
              
              <WebhookField
                form={form}
                name="chatRagWebhook"
                label="Chat RAG Webhook"
                description="Default webhook for Chat interface messages."
              />
              
              <WebhookField
                form={form}
                name="youtubeWebhook"
                label="YouTube Webhook"
                description="Processes YouTube URLs for data extraction."
              />
              
              <WebhookField
                form={form}
                name="newsWebhook"
                label="News Webhook"
                description="Processes news queries and retrieves information."
              />
              
              <Button 
                type="submit" 
                className="w-full bg-[#33C3F0] hover:bg-[#33C3F0]/80 text-black font-medium mt-4 animate-hover-scale"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="chat-types" className="mt-4">
          <ChatTypeSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsForm;
