
import React from 'react';
import FileProgressItem from './upload/FileProgressItem';
import { UploadingFile } from '@/types/file';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Database, FileText } from 'lucide-react';

interface FileListProps {
  files: UploadingFile[];
  onRemoveFile: (fileId: string) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onRemoveFile }) => {
  if (files.length === 0) return null;

  // Calculate total upload progress
  const totalProgress = files.length > 0 
    ? files.reduce((sum, file) => sum + file.progress, 0) / files.length 
    : 0;
  
  // Count files by status
  const statusCounts = {
    uploading: files.filter(file => file.status === 'uploading').length,
    complete: files.filter(file => file.status === 'complete').length,
    error: files.filter(file => file.status === 'error').length
  };

  return (
    <Card className="border-[#33C3F0]/40 bg-[#102a43]/60 shadow-md backdrop-blur-sm">
      <CardHeader className="pb-2 border-b border-[#33C3F0]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Database className="mr-2 h-5 w-5 text-[#33C3F0]" />
            <CardTitle className="text-lg font-space-grotesk text-[#33C3F0]">
              File Repository
            </CardTitle>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-300">
            <span className="flex items-center">
              <FileText className="mr-1 h-4 w-4" />
              {files.length} Files
            </span>
            <span className="flex items-center">
              <Briefcase className="mr-1 h-4 w-4" />
              {(totalProgress).toFixed(0)}% Complete
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col items-center p-2 rounded-md bg-[#102a43]/80 border border-[#33C3F0]/20">
              <span className="text-xs text-gray-400">In Progress</span>
              <span className="text-xl text-[#33C3F0] font-medium">{statusCounts.uploading}</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-md bg-[#102a43]/80 border border-[#33C3F0]/20">
              <span className="text-xs text-gray-400">Completed</span>
              <span className="text-xl text-[#33C3F0] font-medium">{statusCounts.complete}</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-md bg-[#102a43]/80 border border-[#33C3F0]/20">
              <span className="text-xs text-gray-400">Errors</span>
              <span className="text-xl text-[#33C3F0] font-medium">{statusCounts.error}</span>
            </div>
          </div>
          
          {/* Progress bar showing overall upload progress */}
          <div className="w-full h-1.5 bg-[#102a43] rounded-full mb-4 overflow-hidden">
            <div 
              className="h-full bg-[#33C3F0] rounded-full"
              style={{ width: `${totalProgress}%` }}
            ></div>
          </div>
          
          {/* Table view of files */}
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#33C3F0]/20">
                <TableHead className="text-[#33C3F0]">File</TableHead>
                <TableHead className="text-[#33C3F0] text-right">Status</TableHead>
                <TableHead className="text-[#33C3F0] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map(file => (
                <TableRow 
                  key={file.id} 
                  className="border-b border-[#33C3F0]/10 hover:bg-[#102a43]/80"
                >
                  <TableCell>
                    <FileProgressItem 
                      key={file.id} 
                      file={file} 
                      onRemove={onRemoveFile}
                      tableView={true}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    {file.status === 'complete' ? (
                      <span className="text-green-400 text-sm">Processed</span>
                    ) : file.status === 'error' ? (
                      <span className="text-red-400 text-sm">Failed</span>
                    ) : (
                      <span className="text-blue-400 text-sm">{file.progress}%</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <button 
                      onClick={() => onRemoveFile(file.id)}
                      className="text-[#33C3F0] hover:text-white text-sm"
                    >
                      Remove
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileList;
