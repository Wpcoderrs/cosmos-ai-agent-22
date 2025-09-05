-- Create file_processing_queue table for tracking file processing
CREATE TABLE public.file_processing_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  storage_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.file_processing_queue ENABLE ROW LEVEL SECURITY;

-- Create policies for file_processing_queue
CREATE POLICY "Users can view their own files" 
ON public.file_processing_queue 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own file records" 
ON public.file_processing_queue 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own file records" 
ON public.file_processing_queue 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own file records" 
ON public.file_processing_queue 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_file_processing_queue_updated_at
    BEFORE UPDATE ON public.file_processing_queue
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();