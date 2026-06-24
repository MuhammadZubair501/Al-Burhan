// components/ImageUpload.tsx
import React, { useRef, useState, useCallback } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (file: File | null, preview: string) => void;
  error?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  error,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 2 * 1024 * 1024) {
        onChange(null, '');
        return;
      }
      const preview = URL.createObjectURL(file);
      onChange(file, preview);
    }
  }, [onChange]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return;
      const preview = URL.createObjectURL(file);
      onChange(file, preview);
    }
  };

  return (
    <div className={className}>
      <div
        className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed transition-all cursor-pointer overflow-hidden mx-auto ${
          dragActive ? 'border-yellow-400 bg-yellow-400/20' : 'border-white/40 bg-white/5'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <img src={value} alt="Student" className="w-full h-full object-cover" />
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
        onChange={handleUpload}
      />
      {error && <p className="text-red-300 text-xs text-center mt-1">{error}</p>}
      <p className="text-white/50 text-xs text-center mt-1">PNG, JPG up to 2MB</p>
    </div>
  );
};