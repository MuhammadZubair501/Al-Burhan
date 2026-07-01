// src/components/mega/FileIcon.tsx
import {
  File,
  FileImage,
  FileText,
  FileSpreadsheet,
  Presentation,
  FileArchive,
  FileVideo,
  FileAudio,
  Folder,
  FolderOpen,
  FileCode,
  FileJson,
  FileAxis3d,
} from 'lucide-react';
import type { JSX } from 'react/jsx-runtime';

interface FileIconProps {
  fileName: string;
  isFolder: boolean;
  className?: string;
  size?: number;
}

export default function FileIcon({ fileName, isFolder, className = '', size = 24 }: FileIconProps) {
  if (isFolder) {
    return <Folder className={`text-yellow-400 ${className}`} size={size} />;
  }

  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  const iconMap: Record<string, JSX.Element> = {
    // Images
    jpg: <FileImage className="text-purple-400" size={size} />,
    jpeg: <FileImage className="text-purple-400" size={size} />,
    png: <FileImage className="text-purple-400" size={size} />,
    gif: <FileImage className="text-purple-400" size={size} />,
    svg: <FileImage className="text-purple-400" size={size} />,
    webp: <FileImage className="text-purple-400" size={size} />,
    
    // Documents
    pdf: <FileAxis3d className="text-red-400" size={size} />,
    doc: <FileText className="text-blue-400" size={size} />,
    docx: <FileText className="text-blue-400" size={size} />,
    txt: <FileText className="text-gray-400" size={size} />,
    rtf: <FileText className="text-blue-400" size={size} />,
    
    // Spreadsheets
    xls: <FileSpreadsheet className="text-green-400" size={size} />,
    xlsx: <FileSpreadsheet className="text-green-400" size={size} />,
    csv: <FileSpreadsheet className="text-green-400" size={size} />,
    
    // Presentations
    ppt: <Presentation className="text-orange-400" size={size} />,
    pptx: <Presentation className="text-orange-400" size={size} />,
    
    // Archives
    zip: <FileArchive className="text-yellow-500" size={size} />,
    rar: <FileArchive className="text-yellow-500" size={size} />,
    '7z': <FileArchive className="text-yellow-500" size={size} />,
    tar: <FileArchive className="text-yellow-500" size={size} />,
    gz: <FileArchive className="text-yellow-500" size={size} />,
    
    // Code
    js: <FileCode className="text-yellow-300" size={size} />,
    jsx: <FileCode className="text-cyan-300" size={size} />,
    ts: <FileCode className="text-blue-400" size={size} />,
    tsx: <FileCode className="text-cyan-400" size={size} />,
    html: <FileCode className="text-orange-400" size={size} />,
    css: <FileCode className="text-purple-400" size={size} />,
    scss: <FileCode className="text-pink-400" size={size} />,
    json: <FileJson className="text-yellow-400" size={size} />,
    py: <FileCode className="text-blue-500" size={size} />,
    java: <FileCode className="text-red-500" size={size} />,
    cpp: <FileCode className="text-blue-600" size={size} />,
    c: <FileCode className="text-blue-600" size={size} />,
    
    // Videos
    mp4: <FileVideo className="text-pink-400" size={size} />,
    avi: <FileVideo className="text-pink-400" size={size} />,
    mov: <FileVideo className="text-pink-400" size={size} />,
    mkv: <FileVideo className="text-pink-400" size={size} />,
    wmv: <FileVideo className="text-pink-400" size={size} />,
    
    // Audio
    mp3: <FileAudio className="text-green-400" size={size} />,
    wav: <FileAudio className="text-green-400" size={size} />,
    flac: <FileAudio className="text-green-400" size={size} />,
    aac: <FileAudio className="text-green-400" size={size} />,
    ogg: <FileAudio className="text-green-400" size={size} />,
    
    // Executables
    exe: <File className="text-blue-400" size={size} />,
    msi: <File className="text-blue-400" size={size} />,
    dmg: <File className="text-blue-400" size={size} />,
    app: <File className="text-blue-400" size={size} />,
  };

  return iconMap[extension] || <File className={`text-gray-400 ${className}`} size={size} />;
}