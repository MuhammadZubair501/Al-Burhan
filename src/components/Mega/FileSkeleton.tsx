// src/components/Mega/FileSkeleton.tsx
export default function FileSkeleton() {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-white/10 rounded-lg mb-3" />
        <div className="w-20 h-4 bg-white/10 rounded mb-2" />
        <div className="w-12 h-3 bg-white/10 rounded" />
      </div>
    </div>
  );
}