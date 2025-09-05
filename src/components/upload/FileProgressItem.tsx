
import React from 'react';
import { X, Check, AlertCircle, Clock } from 'lucide-react';
import { UploadingFile } from '@/types/file';

interface FileProgressItemProps {
  file: UploadingFile;
  onRemove: (fileId: string) => void;
  tableView?: boolean;
}

const FileProgressItem: React.FC<FileProgressItemProps> = ({ file, onRemove, tableView = false }) => {
  const getFileIcon = () => {
    const extension = file.file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') return '📄';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return '🖼️';
    if (['csv', 'xlsx', 'xls'].includes(extension || '')) return '📊';
    if (['json', 'txt', 'html'].includes(extension || '')) return '📝';
    return '📁';
  };

  const getStatusIcon = () => {
    if (file.status === 'complete') return <Check size={16} className="text-green-500" />;
    if (file.status === 'error') return <AlertCircle size={16} className="text-red-500" />;
    return <Clock size={16} className="text-blue-400 animate-pulse" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024) * 10) / 10 + ' MB';
  };

  if (tableView) {
    return (
      <tr className="border-b border-[#1e375f]/30">
        <td className="py-3 pl-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{getFileIcon()}</span>
            <span className="font-medium truncate max-w-[180px]">{file.file.name}</span>
          </div>
        </td>
        <td className="py-3 px-4">
          <span className="text-sm text-gray-400">{formatFileSize(file.file.size)}</span>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`text-sm ${file.status === 'error' ? 'text-red-400' : ''}`}>
              {file.status === 'complete' ? 'Complete' : file.status === 'error' ? 
                <span title={file.error} className="cursor-help">Error</span> : 
                `${file.progress}%`}
            </span>
            {file.error && (
              <span className="text-xs text-red-400 truncate max-w-[150px]" title={file.error}>
                {file.error}
              </span>
            )}
          </div>
        </td>
        <td className="py-3 pr-4 text-right">
          <button
            onClick={() => onRemove(file.id)}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-[#1e375f]/50"
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        </td>
      </tr>
    );
  }

  return (
    <div className="bg-[#102a43]/80 rounded-lg p-3 border border-[#33C3F0]/30 hover:border-[#33C3F0]/60 transition-all">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className={`infinity-stone`} style={{ backgroundColor: file.color }}></div>
          <span className="font-medium truncate max-w-[180px]" title={file.file.name}>{file.file.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e375f] text-gray-300">
            {formatFileSize(file.file.size)}
          </span>
          <button
            onClick={() => onRemove(file.id)}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-[#1e375f]/50"
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center text-sm text-gray-400 mb-2">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span>
            {file.status === 'complete' 
              ? 'Complete' 
              : file.status === 'error' 
                ? <span className="text-red-400">{file.error ? `Error: ${file.error}` : 'Error'}</span>
                : `Uploading: ${file.progress}%`
            }
          </span>
        </div>
      </div>
      
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${file.progress}%`,
            backgroundColor: file.status === 'error' ? '#f43f5e' : file.color,
          }}
        ></div>
      </div>
    </div>
  );
};

export default FileProgressItem;
