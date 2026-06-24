interface ClassModalBackdropProps {
  onClose: () => void;
}

export default function ClassModalBackdrop({ onClose }: ClassModalBackdropProps) {
  return <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />;
}