import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, CheckCircle, AlertCircle, X, Loader2, File } from 'lucide-react';
import { uploadsApi, UploadResult } from '../../api/uploadsApi.js';
import { toast } from 'sonner';

interface FileUploaderProps {
  onUploadSuccess?: (fileUrl: string, uploadMeta: UploadResult['upload']) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
  currentValue?: string;
  label?: string;
  acceptText?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadSuccess,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
  maxSizeMB = 10,
  currentValue,
  label = 'Upload File',
  acceptText = 'Images (JPG, PNG, WEBP) or PDF up to 10MB',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentValue || null);
  const [uploadedMeta, setUploadedMeta] = useState<UploadResult['upload'] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndUpload = async (file: File) => {
    setErrorMsg(null);

    if (!allowedTypes.includes(file.type)) {
      const err = `Unsupported file type: ${file.type || 'unknown'}. Allowed: Images, PDF.`;
      setErrorMsg(err);
      toast.error(err);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      const err = `File size exceeds maximum allowed size of ${maxSizeMB}MB.`;
      setErrorMsg(err);
      toast.error(err);
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const response = await uploadsApi.uploadFile(file, (percent) => {
        setProgress(percent);
      });

      if (response.data) {
        const fileUrl = response.data.url;
        setUploadedUrl(fileUrl);
        setUploadedMeta(response.data.upload);
        toast.success(`File "${file.name}" uploaded successfully!`);
        if (onUploadSuccess) {
          onUploadSuccess(fileUrl, response.data.upload);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'File upload failed';
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const clearUpload = () => {
    setUploadedUrl(null);
    setUploadedMeta(null);
    setErrorMsg(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isImage = (url?: string | null, mime?: string | null) => {
    if (mime) return mime.startsWith('image/');
    if (!url) return false;
    return /\.(jpeg|jpg|png|gif|webp)$/i.test(url);
  };

  return (
    <div className="w-full space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={allowedTypes.join(',')}
        className="hidden"
      />

      {uploadedUrl ? (
        <div className="relative group border border-border rounded-xl p-3 bg-card flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            {isImage(uploadedUrl, uploadedMeta?.mimeType) ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-border bg-muted flex-shrink-0">
                <img
                  src={uploadedUrl}
                  alt={uploadedMeta?.originalName || 'Preview'}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {uploadedMeta?.originalName || uploadedUrl.split('/').pop()}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Uploaded •{' '}
                {uploadedMeta?.size ? `${(uploadedMeta.size / 1024 / 1024).toFixed(2)} MB` : 'Ready'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline px-2 py-1 rounded bg-primary/10"
            >
              View
            </a>
            <button
              type="button"
              onClick={clearUpload}
              className="p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Remove File"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-border hover:border-primary/50 hover:bg-card/60 bg-card/30'
          } ${uploading ? 'pointer-events-none opacity-80' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-2 space-y-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <div className="w-full max-w-xs space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  <span className="text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{acceptText}</p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> Images
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground flex items-center gap-1">
                  <File className="w-3 h-3" /> PDF
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-destructive flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
        </p>
      )}
    </div>
  );
};
