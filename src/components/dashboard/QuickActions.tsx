import { Plus, Users, UserPlus, FileText, Printer } from 'lucide-react';

export function QuickActions() {
  const actions = [
    { label: 'Mark Student Attendance', icon: <Users size={18} />, onClick: () => console.log('Mark Student Attendance') },
    { label: 'Mark Teacher Attendance', icon: <Users size={18} />, onClick: () => console.log('Mark Teacher Attendance') },
    { label: 'Add Student', icon: <UserPlus size={18} />, onClick: () => console.log('Add Student') },
    { label: 'Add Teacher', icon: <UserPlus size={18} />, onClick: () => console.log('Add Teacher') },
    { label: 'Generate Report', icon: <FileText size={18} />, onClick: () => console.log('Generate Report') },
    { label: 'Export Report', icon: <Printer size={18} />, onClick: () => console.log('Export Report') },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={action.onClick}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-extrabold shadow-xl shadow-amber-500/20 hover:scale-105 hover:shadow-amber-500/30 active:scale-95 transition-all duration-200"
        >
          {action.icon}
          <span className="hidden sm:inline">{action.label}</span>
        </button>
      ))}
    </div>
  );
}