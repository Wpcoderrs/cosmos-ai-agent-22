
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UploadingFile } from '@/types/file';
import { supabase } from '@/integrations/supabase/client';
import { useWebhook } from './useWebhook';

export const useSupabaseUpload = () => {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const { toast } = useToast();
  const { triggerFileProcessingWebhook, recordFileInQueue } = useWebhook();

  const addFiles = (newFiles: UploadingFile[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    
    // Start uploading each file
    newFiles.forEach(fileEntry => {
      uploadToSupabase(fileEntry);
    });
  };

  // Remove file from list
  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Get public URL for a file with verification
  const getPublicURL = (filePath: string) => {
    try {
      // Make sure the bucket exists and the path is valid
      if (!filePath || typeof filePath !== 'string') {
        console.warn("Invalid file path provided to getPublicURL:", filePath);
        return null;
      }
      
      const { data } = supabase.storage.from('file_uploads').getPublicUrl(filePath);
      
      // Validate that we received a proper URL
      if (!data?.publicUrl) {
        console.warn("No public URL was generated:", data);
        return null;
      }
      
      console.log("Generated Supabase public URL:", data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error("Error generating public URL:", error);
      return null;
    }
  };

  // Upload file to Supabase storage
  const uploadToSupabase = async (fileEntry: UploadingFile) => {
    try {
      // Update file status to start upload
      setFiles(prev => 
        prev.map(f => 
          f.id === fileEntry.id 
            ? { ...f, progress: 10, status: 'uploading' } 
            : f
        )
      );
      
      // For development - use a default user ID if not authenticated
      let userId;
      
      try {
        const user = supabase.auth.getUser();
        userId = (await user).data.user?.id;
      } catch (authError) {
        console.warn("Auth error:", authError);
        
        // Show toast notification for authentication error
        toast({
          title: "Authentication Error",
          description: "Please sign in to upload files.",
          variant: "destructive"
        });
        
        // Update file status to error
        setFiles(prev => 
          prev.map(f => 
            f.id === fileEntry.id 
              ? { ...f, progress: 0, status: 'error', error: 'Authentication required' } 
              : f
          )
        );
        
        return;
      }
      
      // For development - use a default user ID if not authenticated
      if (!userId) {
        // Use a development user ID for testing
        userId = "00000000-0000-0000-0000-000000000000";
        console.info("Using development user ID for upload:", userId);
      }
      
      // Create a path for the file
      const filePath = `${userId}/${fileEntry.id}-${fileEntry.file.name}`;
      
      // Update progress to show upload has started
      setFiles(prev => 
        prev.map(f => 
          f.id === fileEntry.id 
            ? { ...f, progress: 25 } 
            : f
        )
      );
      
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('file_uploads')
        .upload(filePath, fileEntry.file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) {
        console.error("Upload error:", error);
        
        // Check for specific error types
        let errorMessage = error.message;
        if (error.message.includes('bucket not found')) {
          errorMessage = 'Storage bucket not found. Please contact support.';
          console.error('Bucket "file_uploads" not found. Check Supabase storage configuration.');
        } else if (error.message.includes('JWT')) {
          errorMessage = 'Session expired. Please sign in again.';
        }
        
        setFiles(prev => 
          prev.map(f => 
            f.id === fileEntry.id 
              ? { ...f, progress: 0, status: 'error', error: errorMessage } 
              : f
          )
        );
        
        toast({
          title: "Upload Failed",
          description: errorMessage,
          variant: "destructive"
        });
        
        return;
      }
      
      // Update progress to show upload is nearly complete
      setFiles(prev => 
        prev.map(f => 
          f.id === fileEntry.id 
            ? { ...f, progress: 75 } 
            : f
        )
      );
      
      // Generate the public URL for the uploaded file
      const publicUrl = getPublicURL(filePath);
      
      if (!publicUrl) {
        console.error("Failed to generate public URL for uploaded file");
        
        setFiles(prev => 
          prev.map(f => 
            f.id === fileEntry.id 
              ? { ...f, progress: 90, status: 'complete', error: 'URL generation issue, but file uploaded' } 
              : f
          )
        );
      }
      
      // Record in the file_processing_queue table and trigger webhook
      try {
        const recordSuccess = await recordFileInQueue(userId, filePath, fileEntry.file.name);
        
        if (recordSuccess) {
          // Attempt to trigger webhook if recording was successful
          await triggerFileProcessingWebhook(userId, {
            storagePath: filePath,
            originalFilename: fileEntry.file.name,
            downloadUrl: publicUrl || supabase.storage.from('file_uploads').getPublicUrl(filePath).data?.publicUrl
          });
        }
      } catch (webhookError) {
        console.error("Error with webhook or recording:", webhookError);
      }
      
      // File upload completed, set progress to 100%
      setFiles(prev => 
        prev.map(f => 
          f.id === fileEntry.id 
            ? { ...f, progress: 100, status: 'complete' } 
            : f
        )
      );
      
      // Show success toast
      toast({
        title: "Upload Complete",
        description: `${fileEntry.file.name} has been successfully uploaded.`,
      });
      
    } catch (err) {
      console.error("Unexpected error during upload:", err);
      
      setFiles(prev => 
        prev.map(f => 
          f.id === fileEntry.id 
            ? { ...f, progress: 0, status: 'error', error: 'Unexpected error occurred' } 
            : f
        )
      );
      
      toast({
        title: "Upload Failed",
        description: "An unexpected error occurred during upload.",
        variant: "destructive"
      });
    }
  };

  return {
    files,
    addFiles,
    removeFile
  };
};
