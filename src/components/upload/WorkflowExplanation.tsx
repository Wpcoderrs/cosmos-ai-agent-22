
import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Info, FileUp, Bot, Database, Webhook } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const WorkflowExplanation: React.FC = () => {
  return (
    <div className="mb-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-xs text-[#33C3F0] hover:bg-[#33C3F0]/10"
          >
            <Info className="h-3.5 w-3.5 mr-1" />
            How it works
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-96 bg-[#0c1526] border border-[#33C3F0]/50 shadow-lg shadow-[#33C3F0]/20 text-white backdrop-blur-lg z-50"
          sideOffset={5}
        >
          <h4 className="font-space-grotesk text-[#33C3F0] text-sm mb-2">File Processing Workflow</h4>
          
          <Carousel className="w-full mb-3">
            <CarouselContent>
              <CarouselItem>
                <div className="bg-[#111a2f] p-3 rounded-md border border-[#33C3F0]/20">
                  <img 
                    src="/lovable-uploads/6de32029-61bf-4045-ace4-87a2f5edb4fe.png" 
                    alt="Data Processing Workflow" 
                    className="w-full h-auto rounded mb-2"
                  />
                  <p className="text-xs text-gray-300">Complete data processing workflow</p>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>

          <div className="flex flex-col space-y-3">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-[#1e375f] flex items-center justify-center mr-3 mt-0.5">
                <FileUp className="h-4 w-4 text-[#33C3F0]" />
              </div>
              <div>
                <h5 className="text-sm font-medium text-[#33C3F0]">1. Upload Files</h5>
                <p className="text-xs text-gray-300">Files are securely uploaded to our cloud storage.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-[#1e375f] flex items-center justify-center mr-3 mt-0.5">
                <Database className="h-4 w-4 text-[#33C3F0]" />
              </div>
              <div>
                <h5 className="text-sm font-medium text-[#33C3F0]">2. Processing Queue</h5>
                <p className="text-xs text-gray-300">Files are added to a processing queue for extraction.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-[#1e375f] flex items-center justify-center mr-3 mt-0.5">
                <Webhook className="h-4 w-4 text-[#33C3F0]" />
              </div>
              <div>
                <h5 className="text-sm font-medium text-[#33C3F0]">3. Data Extraction</h5>
                <p className="text-xs text-gray-300">AI services extract information from your files, including text, structure, and metadata.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-[#1e375f] flex items-center justify-center mr-3 mt-0.5">
                <Bot className="h-4 w-4 text-[#33C3F0]" />
              </div>
              <div>
                <h5 className="text-sm font-medium text-[#33C3F0]">4. Results Available</h5>
                <p className="text-xs text-gray-300">Processed data is available in the AI assistant for questions and analysis.</p>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default WorkflowExplanation;
