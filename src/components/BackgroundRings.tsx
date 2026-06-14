export default function BackgroundRings() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <div className="absolute top-10 left-10 w-72 h-72 border-4 border-yellow-400 rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 border-4 border-yellow-400 rounded-full" />
      <div className="absolute top-1/2 left-1/3 w-56 h-56 border-2 border-white rounded-full" />
    </div>
  );
}