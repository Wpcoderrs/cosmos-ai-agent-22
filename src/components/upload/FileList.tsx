
import React, { useState } from 'react';
import FileProgressItem from './FileProgressItem';
import { UploadingFile } from '@/types/file';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FileListProps {
  files: UploadingFile[];
  onRemoveFile: (fileId: string) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onRemoveFile }) => {
  const [viewType, setViewType] = useState<'card' | 'table'>('table');
  
  if (files.length === 0) return null;

  const uploadingCount = files.filter(f => f.status === 'uploading').length;
  const completedCount = files.filter(f => f.status === 'complete').length;
  const errorCount = files.filter(f => f.status === 'error').length;
  
  const totalProgress = files.length > 0 
    ? Math.round(files.reduce((sum, file) => sum + file.progress, 0) / files.length) 
    : 0;

  return (
    <div className="flex-1 overflow-hidden mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#33C3F0]">
          <span className="font-space-grotesk">FILE REPOSITORY</span>
        </h3>
        <div className="flex space-x-4">
          <button 
            className={`px-3 py-1 rounded-md text-sm transition-colors ${viewType === 'card' ? 'bg-[#1e375f] text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setViewType('card')}
          >
            Card View
          </button>
          <button 
            className={`px-3 py-1 rounded-md text-sm transition-colors ${viewType === 'table' ? 'bg-[#1e375f] text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setViewType('table')}
          >
            Table View
          </button>
        </div>
      </div>

      {/* File Status Overview */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-[#102a43]/80 rounded-lg p-3 border border-[#33C3F0]/20">
          <div className="text-xs text-gray-400">Total Files</div>
          <div className="text-2xl font-semibold mt-1">{files.length}</div>
        </div>
        <div className="bg-[#102a43]/80 rounded-lg p-3 border border-[#33C3F0]/20">
          <div className="text-xs text-gray-400">Uploading</div>
          <div className="text-2xl font-semibold mt-1 text-blue-400">{uploadingCount}</div>
        </div>
        <div className="bg-[#102a43]/80 rounded-lg p-3 border border-[#33C3F0]/20">
          <div className="text-xs text-gray-400">Completed</div>
          <div className="text-2xl font-semibold mt-1 text-green-500">{completedCount}</div>
        </div>
        <div className="bg-[#102a43]/80 rounded-lg p-3 border border-[#33C3F0]/20">
          <div className="text-xs text-gray-400">Errors</div>
          <div className="text-2xl font-semibold mt-1 text-red-500">{errorCount}</div>
        </div>
      </div>

      {/* Total Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span>Total Progress</span>
          <span>{totalProgress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{
              width: `${totalProgress}%`,
              backgroundColor: '#33C3F0',
            }}
          ></div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {viewType === 'table' ? (
            <div className="bg-[#102a43]/80 rounded-lg border border-[#33C3F0]/20 overflow-hidden">
              <ScrollArea className="h-[300px]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#1e375f]/50 text-left">
                      <th className="py-2 pl-4 font-medium text-gray-300">File Name</th>
                      <th className="py-2 px-4 font-medium text-gray-300">Size</th>
                      <th className="py-2 px-4 font-medium text-gray-300">Status</th>
                      <th className="py-2 pr-4 text-right font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map(file => (
                      <FileProgressItem 
                        key={file.id} 
                        file={file} 
                        onRemove={onRemoveFile}
                        tableView={true}
                      />
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-4 pr-4">
                {files.map(file => (
                  <FileProgressItem 
                    key={file.id} 
                    file={file} 
                    onRemove={onRemoveFile} 
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          {viewType === 'table' ? (
            <div className="bg-[#102a43]/80 rounded-lg border border-[#33C3F0]/20 overflow-hidden">
              <ScrollArea className="h-[300px]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#1e375f]/50 text-left">
                      <th className="py-2 pl-4 font-medium text-gray-300">File Name</th>
                      <th className="py-2 px-4 font-medium text-gray-300">Size</th>
                      <th className="py-2 px-4 font-medium text-gray-300">Status</th>
                      <th className="py-2 pr-4 text-right font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.filter(f => f.status === 'complete').map(file => (
                      <FileProgressItem 
                        key={file.id} 
                        file={file} 
                        onRemove={onRemoveFile}
                        tableView={true}
                      />
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-4 pr-4">
                {files.filter(f => f.status === 'complete').map(file => (
                  <FileProgressItem 
                    key={file.id} 
                    file={file} 
                    onRemove={onRemoveFile} 
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
        
        <TabsContent value="errors" className="mt-0">
          {viewType === 'table' ? (
            <div className="bg-[#102a43]/80 rounded-lg border border-[#33C3F0]/20 overflow-hidden">
              <ScrollArea className="h-[300px]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#1e375f]/50 text-left">
                      <th className="py-2 pl-4 font-medium text-gray-300">File Name</th>
                      <th className="py-2 px-4 font-medium text-gray-300">Size</th>
                      <th className="py-2 px-4 font-medium text-gray-300">Status</th>
                      <th className="py-2 pr-4 text-right font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.filter(f => f.status === 'error').map(file => (
                      <FileProgressItem 
                        key={file.id} 
                        file={file} 
                        onRemove={onRemoveFile}
                        tableView={true}
                      />
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-4 pr-4">
                {files.filter(f => f.status === 'error').map(file => (
                  <FileProgressItem 
                    key={file.id} 
                    file={file} 
                    onRemove={onRemoveFile} 
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FileList;
