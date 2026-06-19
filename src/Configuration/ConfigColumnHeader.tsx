type HeaderProps = {
  title: string;
  icon: React.ReactNode;
  itemsCount: number;
};

export default function ConfigColumnHeader({ title, icon, itemsCount }: HeaderProps) {
  return (
    <div className="px-5 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center text-green-950">
          {icon}
        </div>

        <div>
          <h2 className="text-white font-bold text-lg">{title}</h2>
          <p className="text-xs text-green-100">{itemsCount} Records</p>
        </div>
      </div>
    </div>
  );
}