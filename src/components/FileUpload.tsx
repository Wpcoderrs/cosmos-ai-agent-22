
import React from 'react';
import UploadArea from './upload/UploadArea';
import FileList from './upload/FileList';
import { useFileUpload } from './upload/FileUploadHooks';
import MediaInputs from './upload/MediaInputs';
import WorkflowExplanation from './upload/WorkflowExplanation';

const FileUpload: React.FC = () => {
  const {
    isDragging,
    files,
    handleDragOver,
    handleDragLeave,
    handleDragEnter,
    handleDrop,
    handleFileChange,
    removeFile
  } = useFileUpload();

  return (
    <div className="w-full mx-auto h-full flex flex-col">
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-space-grotesk text-[#33C3F0] title-section mb-1">DATA PROCESSOR</h2>
          <WorkflowExplanation />
        </div>
        <p className="text-xs text-gray-300 font-inter mb-2">
          Upload and manage your documents for advanced processing and analysis.
        </p>
      </div>
      
      {/* Media Inputs with reduced spacing */}
      <div className="space-y-1 mb-2">
        <MediaInputs />
      </div>
      
      {/* Upload area with reduced height */}
      <div className="mb-2 flex-shrink-0">
        <UploadArea
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileInputChange={handleFileChange}
        />
      </div>
      
      {/* File list with constrained height */}
      <div className="flex-1 min-h-0">
        <FileList files={files} onRemoveFile={removeFile} />
      </div>
    </div>
  );
};

export default FileUpload;
