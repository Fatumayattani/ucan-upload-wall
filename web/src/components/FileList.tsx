import { ExternalLink, Copy, Check } from 'lucide-react';
import { UploadedFile } from '../types/upload';
import { useState } from 'react';

interface FileListProps {
  files: UploadedFile[];
}

export function FileList({ files }: FileListProps) {
  const [copiedCid, setCopiedCid] = useState<string | null>(null);

  const handleCopyCid = async (cid: string) => {
    try {
      await navigator.clipboard.writeText(cid);
      setCopiedCid(cid);
      setTimeout(() => setCopiedCid(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (files.length === 0) {
    return (
      <div className="w-full max-w-2xl mt-12 text-center">
        <div className="py-16 px-6 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No files uploaded yet. Start by uploading your first file!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Uploaded Files</h2>
      <div className="space-y-3">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                  {file.filename}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span>{formatDate(file.uploadedAt)}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                  <code className="flex-1 text-xs text-gray-700 font-mono truncate">
                    {file.cid}
                  </code>
                  <button
                    onClick={() => handleCopyCid(file.cid)}
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                    title="Copy CID"
                  >
                    {copiedCid === file.cid ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  <a
                    href={`https://w3s.link/ipfs/${file.cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                    title="View on IPFS"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
