export default function DashboardContent() {
  const attendance = [
    { class: "Grade 5", present: 45, absent: 3 },
    { class: "Grade 6", present: 52, absent: 2 },
    { class: "Grade 7", present: 48, absent: 4 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">
        Dashboard
      </h1>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white/10 p-5 rounded-2xl border border-white/20">
          <p className="text-yellow-300">Students</p>
          <h2 className="text-4xl text-white">850</h2>
        </div>

        <div className="bg-white/10 p-5 rounded-2xl border border-white/20">
          <p className="text-yellow-300">Teachers</p>
          <h2 className="text-4xl text-white">45</h2>
        </div>

        <div className="bg-white/10 p-5 rounded-2xl border border-white/20">
          <p className="text-yellow-300">Attendance</p>
          <h2 className="text-4xl text-white">92%</h2>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/10 p-6 rounded-2xl border border-white/20">
        <h2 className="text-white text-xl mb-4">
          Today's Attendance
        </h2>

        <table className="w-full text-white">
          <thead className="border-b border-white/20">
            <tr>
              <th className="text-left py-2">Class</th>
              <th>Present</th>
              <th>Absent</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((a) => (
              <tr key={a.class}>
                <td className="py-2">{a.class}</td>
                <td className="text-center">{a.present}</td>
                <td className="text-center">{a.absent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}