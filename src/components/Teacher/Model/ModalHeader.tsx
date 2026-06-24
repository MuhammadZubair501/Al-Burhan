import React from 'react';
import { X, User } from 'lucide-react';

interface ModalHeaderProps {
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose }) => (
  <>
    <button
      onClick={onClose}
      className="absolute top-4 right-4 z-20 w-10 h-10 rounded-xl 
        bg-white/10 text-white hover:bg-red-500/30 flex items-center 
        justify-center transition"
    >
      <X size={18} />
    </button>
    <div className="px-8 pt-8 pb-6 text-center border-b border-white/10">
      <div
        className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-r 
          from-yellow-400 to-amber-500 flex items-center justify-center 
          shadow-xl"
      >
        <User size={40} className="text-emerald-900" />
      </div>
      <h2 className="mt-4 text-3xl font-bold text-white">Teacher Profile</h2>
      <p className="text-emerald-100 mt-1">Complete your professional information</p>
    </div>
  </>
);