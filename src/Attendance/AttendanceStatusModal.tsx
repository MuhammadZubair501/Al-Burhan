import { X, User, CheckCircle2, Check, Clock, MessageSquare } from "lucide-react";
import { useEffect, useState, type JSX } from "react";
import Swal from "sweetalert2";

export type AttendanceStatus = "present" | "absent" | "leave";

type Props = {
  open: boolean;
  teacherName: string;
  currentStatus: AttendanceStatus;
  currentComment?: string; // added
  loading?: boolean;
  onClose: () => void;
  onSave: (status: AttendanceStatus, comment?: string) => Promise<void>; // now accepts comment
};

const statusOptions: {
  value: AttendanceStatus;
  label: string;
  icon: JSX.Element;
  color: string;
}[] = [
  {
    value: "present",
    label: "Present",
    icon: <Check size={16} />,
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    value: "absent",
    label: "Absent",
    icon: <X size={16} />,
    color: "bg-red-500 hover:bg-red-600",
  },
  {
    value: "leave",
    label: "Leave",
    icon: <Clock size={16} />,
    color: "bg-yellow-500 hover:bg-yellow-600",
  },
];

export default function AttendanceStatusModal({
  open,
  teacherName,
  currentStatus,
  currentComment = "",
  loading = false,
  onClose,
  onSave,
}: Props) {
  const [selectedStatus, setSelectedStatus] =
    useState<AttendanceStatus>(currentStatus);
  const [comment, setComment] = useState<string>(currentComment || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedStatus(currentStatus);
    setComment(currentComment || "");
  }, [currentStatus, currentComment]);

  // When status changes away from leave, clear comment
  const handleStatusChange = (status: AttendanceStatus) => {
    setSelectedStatus(status);
    if (status !== 'leave') {
      setComment('');
    }
  };

  const handleSave = async () => {
    // Confirm before saving
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to change the status to "${selectedStatus}".`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update!",
    });

    if (!confirm.isConfirmed) return;

    setIsSaving(true);
    try {
      // If status is leave, send comment; otherwise undefined
      const commentToSend = selectedStatus === 'leave' ? comment : undefined;
      await onSave(selectedStatus, commentToSend);
      await Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Attendance status has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      onClose();
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update attendance status. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative px-8 py-8 text-center">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <X size={20} />
          </button>

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 shadow-xl">
            <User className="text-green-900" size={38} />
          </div>

          <h2 className="mt-5 text-3xl font-bold text-white">
            Update Attendance
          </h2>

          <p className="mt-2 text-lg font-medium text-green-100">
            {teacherName}
          </p>
        </div>

        {/* Body */}
        <div className="px-8 pb-8">
          <p className="mb-3 text-sm font-medium text-green-200">
            Select New Status
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {statusOptions.map((option) => {
              const active = selectedStatus === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleStatusChange(option.value)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                    ${
                      active
                        ? `${option.color} text-white shadow-lg scale-105`
                        : "bg-white/5 text-green-100 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  {option.icon}
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Comment input - only if leave is selected */}
          {selectedStatus === 'leave' && (
            <div className="mt-5">
              <label className="block text-sm font-medium text-green-200 mb-1.5">
                Reason for Leave
              </label>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl border border-white/20 p-2">
                <MessageSquare className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Enter reason for leave..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-green-200/50 focus:outline-none text-sm"
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20"
            >
              Cancel
            </button>
            <button
              disabled={loading || isSaving}
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-7 py-3 font-bold text-green-950 shadow-xl transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 size={20} />
              {isSaving ? "Update..." : "Update Status"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}