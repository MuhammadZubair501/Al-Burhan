import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface ProfileUploadProps {
  preview: string;
  error?: string;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dragActive: boolean;
  setDragActive: (active: boolean) => void;
}

export const ProfileUpload: React.FC<ProfileUploadProps> = ({
  preview,
  error,
  onDrop,
  onUpload,
  dragActive,
  setDragActive,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center mb-4">
      <div
        className={`relative w-32 h-32 rounded-full border-2 border-dashed 
          transition-all cursor-pointer overflow-hidden
          ${
            dragActive
              ? 'border-yellow-400 bg-yellow-400/20'
              : 'border-white/40 bg-white/5'
          }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/60">
            <Upload size={28} />
            <span className="text-[10px] mt-1">Upload</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onUpload}
      />
      {error && <p className="text-red-300 text-xs mt-1">{error}</p>}
      <p className="text-white/40 text-xs mt-1">PNG, JPG up to 2MB</p>
    </div>
  );
};