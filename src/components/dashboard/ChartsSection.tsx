// components/dashboard/ChartsSection.tsx

import { ChartCard } from '../common/ChartCard';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import type { DashboardData } from '../../types/dashboard';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface ChartsSectionProps {
  studentData: DashboardData['studentCharts'];
  teacherData: DashboardData['teacherCharts'];
}

export function ChartsSection({ studentData, teacherData }: ChartsSectionProps) {
  const pieColors = ['#4ade80', '#f87171', '#facc15'];
  const teacherPieColors = ['#60a5fa', '#f87171', '#facc15'];

  const pieOptions = {
    plugins: { 
      legend: { 
        labels: { color: '#fff' } 
      } 
    },
  };

  const barOptions = {
    plugins: { 
      legend: { 
        labels: { color: '#fff' } 
      } 
    },
    scales: {
      x: { 
        ticks: { color: '#ccc' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      y: { 
        ticks: { color: '#ccc' },
        grid: { color: 'rgba(255,255,255,0.05)' },
        beginAtZero: true
      },
    },
  };

  return (
    <>
      {/* Student Charts */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Student Attendance Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Student Attendance Distribution">
            <Pie
              data={{
                labels: studentData.pie.labels,
                datasets: [{ 
                  data: studentData.pie.data, 
                  backgroundColor: pieColors,
                  borderColor: ['#1a2a3a', '#1a2a3a', '#1a2a3a'],
                  borderWidth: 2
                }],
              }}
              options={pieOptions}
            />
          </ChartCard>
          <ChartCard title="Student Attendance by Class">
            <Bar
              data={{
                labels: studentData.bar.labels,
                datasets: [
                  { 
                    label: 'Present', 
                    data: studentData.bar.present, 
                    backgroundColor: '#4ade80' 
                  },
                  { 
                    label: 'Absent', 
                    data: studentData.bar.absent, 
                    backgroundColor: '#f87171' 
                  },
                  { 
                    label: 'Leave', 
                    data: studentData.bar.leave, 
                    backgroundColor: '#facc15' 
                  },
                ],
              }}
              options={barOptions}
            />
          </ChartCard>
        </div>
      </div>

      {/* Teacher Charts */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Teacher Attendance Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Teacher Attendance Distribution">
            <Pie
              data={{
                labels: teacherData.pie.labels,
                datasets: [{ 
                  data: teacherData.pie.data, 
                  backgroundColor: teacherPieColors,
                  borderColor: ['#1a2a3a', '#1a2a3a', '#1a2a3a'],
                  borderWidth: 2
                }],
              }}
              options={pieOptions}
            />
          </ChartCard>
          <ChartCard title="Teacher Attendance by Department">
            <Bar
              data={{
                labels: teacherData.bar.labels,
                datasets: [
                  { 
                    label: 'Present', 
                    data: teacherData.bar.present, 
                    backgroundColor: '#60a5fa' 
                  },
                  { 
                    label: 'Absent', 
                    data: teacherData.bar.absent, 
                    backgroundColor: '#f87171' 
                  },
                  { 
                    label: 'Leave', 
                    data: teacherData.bar.leave, 
                    backgroundColor: '#facc15' 
                  },
                ],
              }}
              options={barOptions}
            />
          </ChartCard>
        </div>
      </div>
    </>
  );
}