// src/components/Mega/FileBadge.tsx
interface FileBadgeProps {
  fileName: string;
  isFolder: boolean;
}

export default function FileBadge({ fileName, isFolder }: FileBadgeProps) {
  if (isFolder) {
    return (
      <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-400 text-xs rounded-full">
        Folder
      </span>
    );
  }

  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const typeMap: Record<string, { label: string; color: string }> = {
    pdf: { label: 'PDF', color: 'bg-red-400/20 text-red-400' },
    doc: { label: 'DOC', color: 'bg-blue-400/20 text-blue-400' },
    docx: { label: 'DOCX', color: 'bg-blue-400/20 text-blue-400' },
    xls: { label: 'XLS', color: 'bg-green-400/20 text-green-400' },
    xlsx: { label: 'XLSX', color: 'bg-green-400/20 text-green-400' },
    ppt: { label: 'PPT', color: 'bg-orange-400/20 text-orange-400' },
    pptx: { label: 'PPTX', color: 'bg-orange-400/20 text-orange-400' },
    jpg: { label: 'JPG', color: 'bg-purple-400/20 text-purple-400' },
    jpeg: { label: 'JPEG', color: 'bg-purple-400/20 text-purple-400' },
    png: { label: 'PNG', color: 'bg-purple-400/20 text-purple-400' },
    gif: { label: 'GIF', color: 'bg-purple-400/20 text-purple-400' },
    svg: { label: 'SVG', color: 'bg-purple-400/20 text-purple-400' },
    zip: { label: 'ZIP', color: 'bg-yellow-500/20 text-yellow-500' },
    rar: { label: 'RAR', color: 'bg-yellow-500/20 text-yellow-500' },
    mp4: { label: 'MP4', color: 'bg-pink-400/20 text-pink-400' },
    avi: { label: 'AVI', color: 'bg-pink-400/20 text-pink-400' },
    mp3: { label: 'MP3', color: 'bg-green-400/20 text-green-400' },
    wav: { label: 'WAV', color: 'bg-green-400/20 text-green-400' },
    js: { label: 'JS', color: 'bg-yellow-300/20 text-yellow-300' },
    ts: { label: 'TS', color: 'bg-blue-400/20 text-blue-400' },
    jsx: { label: 'JSX', color: 'bg-cyan-300/20 text-cyan-300' },
    tsx: { label: 'TSX', color: 'bg-cyan-400/20 text-cyan-400' },
    json: { label: 'JSON', color: 'bg-yellow-400/20 text-yellow-400' },
    html: { label: 'HTML', color: 'bg-orange-400/20 text-orange-400' },
    css: { label: 'CSS', color: 'bg-purple-400/20 text-purple-400' },
  };

  const type = typeMap[extension] || { label: extension.toUpperCase(), color: 'bg-gray-400/20 text-gray-400' };

  return (
    <span className={`px-2 py-0.5 ${type.color} text-xs rounded-full`}>
      {type.label}
    </span>
  );
}