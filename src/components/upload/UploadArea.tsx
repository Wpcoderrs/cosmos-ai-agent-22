
import React, { useRef } from 'react';
import { Upload, File, FileSpreadsheet, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadAreaProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInputChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div 
      className={cn(
        "upload-area w-full border-dashed border-2 rounded-lg transition-all duration-300",
        "bg-[#111a2f]/80 border-[#33C3F0]/40",
        isDragging ? "upload-area-dragging border-[#33C3F0] shadow-glow animate-pulse" : "hover:border-[#33C3F0]/60 hover:shadow-glow"
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="text-center w-full py-6">
        <Upload className={cn(
          "mx-auto h-10 w-10 mb-3 animate-float",
          isDragging ? "text-[#33C3F0] animate-pulse" : "text-[#33C3F0]"
        )} />
        
        <h3 className={cn(
          "text-xl mb-1 font-space-grotesk",
          isDragging ? "text-white scale-105 transition-all" : "text-[#33C3F0]"
        )}>
          {isDragging ? "RELEASE TO UPLOAD" : "DROP FILES HERE"}
        </h3>
        
        <p className={cn(
          "text-sm mb-4 font-inter max-w-md mx-auto px-4",
          isDragging ? "text-[#33C3F0]" : "text-gray-400"
        )}>
          {isDragging 
            ? "Files detected! Drop them here to begin processing." 
            : "Upload documents to process and analyze. Drag files here or browse."
          }
        </p>
        
        <div className={cn(
          "flex flex-wrap justify-center gap-6 mb-4",
          isDragging ? "opacity-70" : ""
        )}>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#1e375f] flex items-center justify-center mb-1">
              <File className="h-5 w-5 text-[#33C3F0]" />
            </div>
            <span className="text-xs text-gray-400">Documents</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#1e375f] flex items-center justify-center mb-1">
              <FileSpreadsheet className="h-5 w-5 text-[#33C3F0]" />
            </div>
            <span className="text-xs text-gray-400">Spreadsheets</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#1e375f] flex items-center justify-center mb-1">
              <FileImage className="h-5 w-5 text-[#33C3F0]" />
            </div>
            <span className="text-xs text-gray-400">Images</span>
          </div>
        </div>
        
        <div className="flex justify-center w-full">
          <button 
            className={cn(
              "bg-[#33C3F0] text-black font-bold py-1.5 px-6 rounded-md transition-all text-sm",
              isDragging ? "opacity-70" : "hover:bg-[#0EA5E9]"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </button>
        </div>
        
        <input 
          ref={fileInputRef} 
          type="file" 
          className="hidden" 
          onChange={onFileInputChange}
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.gif,.csv,.xlsx,.xls,.html,.json,.txt"
        />
      </div>
    </div>
  );
};

export default UploadArea;
