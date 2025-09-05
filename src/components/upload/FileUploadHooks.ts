
import { useCallback } from 'react';
import { useDropzone } from '@/hooks/useDropzone';
import { useFileValidation } from '@/hooks/useFileValidation';
import { useSupabaseUpload } from '@/hooks/useSupabaseUpload';
import { UploadingFile } from '@/types/file';

export const useFileUpload = () => {
  const { isDragging, handleDragOver, handleDragLeave, handleDragEnter, handleDrop } = useDropzone();
  const { validateAndCreateFileEntry } = useFileValidation();
  const { files, addFiles, removeFile } = useSupabaseUpload();

  // Handle file drop with validation
  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const droppedFiles = handleDrop(e);
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  }, [handleDrop]);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  // Process files
  const handleFiles = (fileList: File[]) => {
    const validFiles: UploadingFile[] = [];
    
    for (const file of fileList) {
      const fileEntry = validateAndCreateFileEntry(file);
      if (fileEntry) {
        validFiles.push(fileEntry);
      }
    }
    
    if (validFiles.length > 0) {
      addFiles(validFiles);
    }
  };

  return {
    isDragging,
    files,
    handleDragOver,
    handleDragLeave,
    handleDragEnter,
    handleDrop: handleFileDrop,
    handleFileChange,
    removeFile
  };
};
