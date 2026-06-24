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
    <div className="px-4 sm:px-8 py-4 sm:py-8 flex flex-col sm:flex-row justify-end gap-3 flex-shrink-0 border-t border-white/10">
      <button
        onClick={onCancel}
        disabled={loading}
        className="
          w-full sm:w-auto
          px-6 py-3
          rounded-2xl
          bg-white/10
          text-white
          hover:bg-white/20
          text-sm sm:text-base
          transition-colors
          disabled:opacity-50
        "
      >
        Cancel
      </button>

      <button
        onClick={onSubmit}
        disabled={!isValid || loading}
        className="
          w-full sm:w-auto
          px-8 py-3
          rounded-2xl
          bg-gradient-to-r
          from-yellow-400
          to-amber-500
          text-green-950
          font-bold
          hover:scale-105
          transition-all
          disabled:opacity-40
          disabled:hover:scale-100
          text-sm sm:text-base
          flex items-center justify-center gap-2
        "
      >
        {loading ? (
          <>
            <span className="animate-spin">⏳</span>
            {mode === 'edit' ? 'Updating...' : 'Saving...'}
          </>
        ) : (
          mode === 'edit' ? 'Update Class' : 'Save Class'
        )}
      </button>
    </div>
  );
}