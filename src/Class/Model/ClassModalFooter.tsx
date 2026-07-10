// components/ClassModalFooter.tsx
interface Props {
  onCancel: () => void;
  onSubmit: () => void;
  isValid: boolean;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

export default function ClassModalFooter({ 
  onCancel, 
  onSubmit, 
  isValid, 
  loading = false,
  mode = 'create' 
}: Props) {
  return (
    <div className="flex-shrink-0 sticky bottom-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900/95 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 border-t border-white/10">
      <button
        onClick={onCancel}
        disabled={loading}
        className="
          w-full sm:w-auto
          px-4 sm:px-6 py-2.5 sm:py-3
          rounded-xl sm:rounded-2xl
          bg-white/10
          text-white
          hover:bg-white/20
          text-sm sm:text-base
          transition-colors
          disabled:opacity-50
          order-2 sm:order-1
        "
      >
        Cancel
      </button>

      <button
        onClick={onSubmit}
        disabled={!isValid || loading}
        className="
          w-full sm:w-auto
          px-6 sm:px-8 py-2.5 sm:py-3
          rounded-xl sm:rounded-2xl
          bg-gradient-to-r
          from-yellow-400
          to-amber-500
          text-green-950
          font-bold
          hover:scale-[1.02]
          transition-all
          disabled:opacity-40
          disabled:hover:scale-100
          text-sm sm:text-base
          flex items-center justify-center gap-2
          order-1 sm:order-2
          shadow-lg shadow-yellow-500/20
        "
      >
        {loading ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-green-950 border-t-transparent"></span>
            {mode === 'edit' ? 'Updating...' : 'Saving...'}
          </>
        ) : (
          mode === 'edit' ? 'Update Class' : 'Save Class'
        )}
      </button>
    </div>
  );
}