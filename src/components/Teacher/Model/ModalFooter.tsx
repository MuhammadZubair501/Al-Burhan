import React from 'react';

interface ModalFooterProps {
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ 
  onClose, 
  onSubmit, 
  isSubmitting = false,
  mode = 'create'
}) => (
  <div className="px-8 py-6 bg-black/20 flex justify-end gap-3 border-t border-white/10">
    <button
      onClick={onClose}
      disabled={isSubmitting}
      className="px-6 py-2.5 rounded-xl bg-white/10 text-white 
        hover:bg-white/20 transition disabled:opacity-50"
    >
      Cancel
    </button>
    <button
      onClick={onSubmit}
      disabled={isSubmitting}
      className="px-8 py-2.5 rounded-xl bg-gradient-to-r 
        from-yellow-400 to-amber-500 text-emerald-950 font-bold 
        hover:scale-105 transition shadow-lg disabled:opacity-50 
        disabled:hover:scale-100 flex items-center gap-2"
    >
      {isSubmitting ? (
        <>
          <span className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-950 border-t-transparent"></span>
          {mode === 'edit' ? 'Updating...' : 'Creating...'}
        </>
      ) : (
        mode === 'edit' ? 'Update Teacher' : 'Save Teacher'
      )}
    </button>
  </div>
);