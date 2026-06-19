import { useState } from "react";
import {

  Pencil,
  Trash2,
  Users,

} from "lucide-react";
import PageHeader from "./PageHeader";

type Status = "present" | "absent" | "late" | "leave";

type AttendanceTab =
  | "teacher"
  | "student"
  | "teacherRecord"
  | "studentRecord";

type Person = {
  id: number;
  name: string;
  father: string;
};

type SectionKey =
  | "SEC-A"
  | "SEC-B"
  | "SEC-C"
  | "SEC-D"
  | "SEC-E"
  | "SEC-F"
  | "SEC-G"
  | "SEC-H"
  | "SEC-I"
  | "SEC-J"
  | "SEC-K"
  | "SEC-L"
  | "SEC-M"
  | "SEC-N"
  | "SEC-O"
  | "SEC-P"
  | "SEC-Q"
  | "SEC-R"
  | "SEC-S"
  | "SEC-T"
  | "SEC-U"
  | "SEC-V"
  | "SEC-W"
  | "SEC-X"
  | "SEC-Y"
  | "SEC-Z";

type StudentData = Record<SectionKey, Person[]>;

/* ---------------- DATA ---------------- */

const teachers: Person[] = [
  { id: 1, name: "Ahmed Khan", father: "Ali Khan" },
  { id: 2, name: "Usman Ali", father: "Hassan Ali" },
  { id: 3, name: "Bilal Ahmed", father: "Rashid Ahmed" },
];

const students: StudentData = {
  "SEC-A": [
    { id: 1, name: "Ali Raza", father: "Imran Raza" },
    { id: 2, name: "Hamza Khan", father: "Saeed Khan" },
  ],
  "SEC-B": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-C": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-D": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-E": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-F": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-G": [
    { id: 1, name: "Ali Raza", father: "Imran Raza" },
    { id: 2, name: "Hamza Khan", father: "Saeed Khan" },
  ],
  "SEC-H": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-I": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-J": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-K": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-L": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-M": [
    { id: 1, name: "Ali Raza", father: "Imran Raza" },
    { id: 2, name: "Hamza Khan", father: "Saeed Khan" },
  ],
  "SEC-N": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-O": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-P": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-Q": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-R": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-S": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-T": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-U": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-V": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-W": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-X": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-Y": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
  "SEC-Z": [
    { id: 1, name: "Zain Ali", father: "Ali Raza" },
    { id: 2, name: "Omar Farooq", father: "Farooq Ahmed" },
  ],
};


/* ---------------- COMPONENT ---------------- */

export default function AttendancePage() {
  const getDateRange = (start: string, end: string): Date[] => {
  if (!start || !end) return [];

  const dates: Date[] = [];
  const current = new Date(start);
  const last = new Date(end);

  while (current <= last) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};




  const [tab, setTab] = useState<AttendanceTab>("teacher");
  const [date, setDate] = useState("");
  const [section, setSection] = useState<SectionKey>("SEC-A");

  const [teacherAttendance, setTeacherAttendance] = useState<
    Record<number, Status>
  >({});
  const [studentAttendance, setStudentAttendance] = useState<
    Record<number, Status>
  >({});

  const [teacherId, setTeacherId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const sectionStudents = students[section];
  const dateColumns: Date[] = getDateRange(fromDate, toDate);

  const tabs: AttendanceTab[] = [
    "teacher",
    "student",
    "teacherRecord",
    "studentRecord",
  ];

  const inputClass =
    "px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-yellow-400/40";

  return (
    <div className="text-white">
         <PageHeader
            title= " Attendance Management"
            description="Manage teacher and student attendance system"
            Icon={Users}
        />
           {/* TABS */}
        <div className="sticky top-0 z-20 backdrop-blur-xl rounded-2xl mb-6 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base transition ${
                tab === t
                  ? "bg-yellow-400 text-green-950 font-semibold"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {t === "teacher" && "Teacher Attendance"}
              {t === "student" && "Student Attendance"}
              {t === "teacherRecord" && "Teacher Records"}
              {t === "studentRecord" && "Student Records"}
            </button>
          ))}
        </div>
      <div className="max-w-7xl ">

        {/* TOP BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">

          {/* SECTION SCROLL */}
          {(tab === "student" || tab === "studentRecord") && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Object.keys(students).map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSection(sec as SectionKey)}
                  className={`whitespace-nowrap px-3 py-2 rounded-xl text-sm transition ${
                    section === sec
                      ? "bg-yellow-400 text-green-950"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          )}

          {/* ATTENDANCE INPUTS */}
          {(tab === "teacher" || tab === "student") && (
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
              <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-semibold hover:scale-[1.02] transition">
                Submit
              </button>
            </div>
          )}

          {/* FILTERS */}
          {(tab === "teacherRecord" || tab === "studentRecord") && (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="ID"
                value={tab === "teacherRecord" ? teacherId : studentId}
                onChange={(e) =>
                  tab === "teacherRecord"
                    ? setTeacherId(e.target.value)
                    : setStudentId(e.target.value)
                }
                className={inputClass}
              />
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={inputClass} />
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={inputClass} />
              <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-semibold hover:scale-[1.02] transition">
                Filter
              </button>
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-white/20 backdrop-blur-xl bg-white/5">

          {/* ATTENDANCE TABLE */}
          {(tab === "teacher" || tab === "student") && (
            <table className="w-full">
              <thead className="text-left text-yellow-300 bg-white/5">
                <tr>
                  <th className="p-4">S.No</th>
                  <th>Name</th>
                  <th>Father Name</th>
                  <th>Attendance</th>
                </tr>
              </thead>

              <tbody>
                {(tab === "teacher" ? teachers : sectionStudents).map(
                  (person, index) => (
                    <tr key={person.id} className="border-t border-white/10 hover:bg-white/5">
                      <td className="p-4">{index + 1}</td>
                      <td>{person.name}</td>
                      <td>{person.father}</td>
                      <td>
<td>
  <div className="flex overflow-hidden rounded-xl border border-white/20 w-fit">
    {[
      { value: "absent", label: "Absent" },
      { value: "present", label: "Present" },
      { value: "leave", label: "Leave" },
    ].map((option) => {
      const currentValue =
        tab === "teacher"
          ? teacherAttendance[person.id] || "absent"
          : studentAttendance[person.id] || "absent";

      const isSelected = currentValue === option.value;

      return (
        <button
          key={option.value}
          type="button"
          onClick={() => {
            if (tab === "teacher") {
              setTeacherAttendance({
                ...teacherAttendance,
                [person.id]: option.value as Status,
              });
            } else {
              setStudentAttendance({
                ...studentAttendance,
                [person.id]: option.value as Status,
              });
            }
          }}
          className={`px-5 py-2 transition-all duration-200 font-medium border-r border-white/10 last:border-r-0 ${
            isSelected
              ? option.value === "present"
                ? "bg-green-500 text-white"
                : option.value === "absent"
                ? "bg-red-500 text-white"
                : "bg-yellow-500 text-black"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {option.label}
        </button>
      );
    })}
  </div>
</td>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}

{/* RECORD TABLE (SPLIT VIEW) */}
{(tab === "teacherRecord" || tab === "studentRecord") && (
  <div className="flex overflow-x-auto border border-white/20 rounded-2xl bg-white/5">

    {/* LEFT TABLE (Sticky ID + Name) */}
    <table className="min-w-[300px] border-collapse sticky left-0 z-30 bg-black/30 backdrop-blur-xl">
      <thead className="text-left text-yellow-300 bg-white/5">
        <tr>
          <th className="p-4 border-r border-white/10 w-[80px]">ID</th>
          <th className="p-4 w-[200px]">Name</th>
        </tr>
      </thead>

      <tbody>
        {(tab === "teacherRecord" ? teachers : sectionStudents).map((person) => (
          <tr key={person.id} className="border-t border-white/10 hover:bg-white/5">
            <td className="p-4 border-r border-white/10">{person.id}</td>
            <td className="p-4">{person.name}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* RIGHT TABLE (DATES ONLY) */}
    <div className="overflow-x-auto w-full">
      <table className="min-w-max border-collapse">
        <thead className="text-left text-yellow-300 bg-white/5">
          <tr>
            {dateColumns.map((date) => (
              <th
                key={date.toISOString()}
                className="px-10 py-3 text-center whitespace-nowrap border-l border-white/10"
              >
                <div className="flex flex-col items-center gap-2">
                  <span>
                    {date.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>

                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-white/10 text-yellow-300 hover:bg-yellow-400/20">
                      <Pencil size={16} />
                    </button>

                    <button className="p-2 rounded-lg bg-white/10 text-red-300 hover:bg-red-500/20">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {(tab === "teacherRecord" ? teachers : sectionStudents).map((person) => (
            <tr key={person.id} className="border-t border-white/10 hover:bg-white/5">

              {dateColumns.map((_, index) => {
                const status =
                  index % 3 === 0
                    ? "P"
                    : index % 3 === 1
                    ? "A"
                    : "L";

                return (
                  <td
                    key={index}
                    className="px-4 py-3 text-center border-l border-white/10"
                  >
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        status === "P"
                          ? "bg-green-500/20 text-green-300"
                          : status === "A"
                          ? "bg-red-500/20 text-red-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  </div>
)}
        </div>
      </div>
    </div>
  );
}