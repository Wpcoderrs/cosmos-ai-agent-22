
import { useToast } from "@/hooks/use-toast";
import { isValidFileType, STONE_COLORS } from '@/utils/fileUtils';
import { v4 as uuidv4 } from 'uuid';
import { UploadingFile } from '@/types/file';

export const useFileValidation = () => {
  const { toast } = useToast();
  
  const validateAndCreateFileEntry = (file: File): UploadingFile | null => {
    if (!isValidFileType(file)) {
      toast({
        title: "Reality Rejected",
        description: `${file.name} - Invalid format or too large.`,
        variant: "destructive"
      });
      console.error(`Invalid file type: ${file.name} (${file.type})`);
      return null;
    }

    // Generate a unique ID for the file
    const fileId = uuidv4();

    // Create new file entry
    return {
      id: fileId,
      file,
      progress: 0,
      status: 'uploading',
      color: STONE_COLORS[Math.floor(Math.random() * STONE_COLORS.length)]
    };
  };

  return { validateAndCreateFileEntry };
};
