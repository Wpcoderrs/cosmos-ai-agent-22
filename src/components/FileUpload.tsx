
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
    <div className="w-full mx-auto">
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-space-grotesk text-[#33C3F0] title-section mb-1">DATA PROCESSOR</h2>
          <WorkflowExplanation />
        </div>
        <p className="text-sm text-gray-300 font-inter mb-3">
          Upload and manage your documents for advanced processing and analysis.
        </p>
      </div>
      
      {/* Media Inputs with reduced spacing */}
      <div className="space-y-2 mb-3">
        <MediaInputs />
      </div>
      
      {/* Upload area with reduced height */}
      <div className="mb-3">
        <UploadArea
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileInputChange={handleFileChange}
        />
      </div>
      
      {/* File list */}
      <FileList files={files} onRemoveFile={removeFile} />
    </div>
  );
};

export default FileUpload;
