# AI Agent Engine - Webhook Setup Guide

## Overview
Your application is already configured with webhook functionality to integrate with your AI agent engine. Here's how to set up and use the webhooks:

## Available Webhook Types

### 1. File Processing Webhook
**Endpoint**: Set in Settings → File Processing Webhook
**Purpose**: Triggered when users upload files for processing
**Payload**:
```json
{
  "storagePath": "user-id/filename.ext",
  "originalFilename": "document.pdf",
  "downloadUrl": "https://your-supabase-url.supabase.co/storage/v1/object/public/file_uploads/user-id/filename.ext"
}
```

### 2. YouTube Analysis Webhook
**Endpoint**: Set in Settings → YouTube Webhook
**Purpose**: Triggered when users submit YouTube URLs for analysis
**Payload**:
```json
{
  "youtubeUrl": "https://youtube.com/watch?v=example",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3. News Analysis Webhook
**Endpoint**: Set in Settings → News Webhook
**Purpose**: Triggered when users request news analysis
**Payload**:
```json
{
  "newsQuery": "AI technology trends",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 4. Chat RAG Webhook
**Endpoint**: Set in Settings → Chat RAG Webhook
**Purpose**: For RAG-enabled chat conversations
**Usage**: Can be configured per chat type

## Setup Instructions

### 1. Database Setup
Run the provided `database-setup.sql` file in your Supabase SQL Editor:
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy and paste the entire `database-setup.sql` content
5. Run the query

### 2. Configure Webhook URLs
1. Access the Settings page in your application
2. Enter your AI agent webhook URLs for each service type
3. Your AI agent should be able to receive POST requests at these endpoints

### 3. AI Agent Implementation
Your AI agent should implement endpoints that can receive the webhook payloads shown above. Here's an example structure:

```python
# Example Flask endpoint for file processing
@app.route('/webhooks/file-processing', methods=['POST'])
def handle_file_processing():
    data = request.json
    storage_path = data['storagePath']
    original_filename = data['originalFilename']
    download_url = data['downloadUrl']
    
    # Download and process the file
    # Send results back to your application
    
    return {'status': 'success'}
```

## Webhook Security
- All webhooks are sent as POST requests with JSON payloads
- Implement proper authentication and validation in your AI agent
- Consider adding webhook signature verification for security

## Testing
1. Upload a file to test the file processing webhook
2. Submit a YouTube URL to test the YouTube webhook
3. Use the news analysis feature to test the news webhook
4. Monitor your AI agent logs to ensure webhooks are being received

## File Storage
- Files are stored in Supabase Storage under the `file_uploads` bucket
- Each user has their own folder: `user-id/filename.ext`
- Download URLs are public and can be accessed directly by your AI agent

## Database Tables
- `user_settings`: Stores webhook URLs and user preferences
- `file_processing_queue`: Tracks uploaded files and processing status
- `chat_types`: Different chat configurations with optional webhook URLs
- `conversations` & `messages`: Chat history storage
- `system_prompts`: AI prompt templates