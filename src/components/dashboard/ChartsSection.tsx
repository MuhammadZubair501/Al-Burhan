// components/dashboard/ChartsSection.tsx

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
import type { ChartOptions } from 'chart.js';
import type { DashboardData } from '../../types/dashboard';
import { PieChart, BarChart3 } from 'lucide-react';

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
}

export function ChartsSection({ studentData }: ChartsSectionProps) {
  const pieColors = ['#4ade80', '#f87171', '#facc15'];

  const pieOptions: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#e5e7eb',
          font: {
            size: 14,
          },
          padding: 25,
          usePointStyle: true,
          pointStyle: 'circle' as const,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        titleColor: '#fff',
        bodyColor: '#e5e7eb',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 14,
        cornerRadius: 10,
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? Math.round((context.parsed / total) * 100) : 0;
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      },
    },
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.8,
    cutout: '0%',
    radius: '85%',
  };

  const barOptions: ChartOptions<'bar'> = {
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e5e7eb',
          font: {
            size: 14,
          },
          padding: 25,
          usePointStyle: true,
          pointStyle: 'rect' as const,
          boxWidth: 16,
          boxHeight: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        titleColor: '#fff',
        bodyColor: '#e5e7eb',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 14,
        cornerRadius: 10,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af',
          font: {
            size: 13,
          },
          maxRotation: 25,
          minRotation: 0,
        },
        grid: {
          color: 'rgba(255,255,255,0.05)',
          drawOnChartArea: true,
        },
      },
      y: {
        ticks: {
          color: '#9ca3af',
          font: {
            size: 13,
          },
          stepSize: 1,
        },
        grid: {
          color: 'rgba(255,255,255,0.05)',
          drawOnChartArea: true,
        },
        beginAtZero: true,
      },
    },
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.8,
  };

  const hasData = studentData?.pie?.data?.some(val => val > 0) || 
                  studentData?.bar?.labels?.length > 0;

  if (!hasData) {
    return (
      <div className="w-full backdrop-blur-xl bg-white/5 rounded-2xl p-10 border border-white/10 text-center">
        <div className="flex flex-col items-center gap-4">
          <PieChart className="w-14 h-14 text-green-100/30" />
          <p className="text-green-100/50 text-sm">No attendance data available for the selected date</p>
        </div>
      </div>
    );
  }

  // Calculate totals for summary
  const totalStudents = studentData.bar.present.reduce((a, _b, index) => {
    return a + studentData.bar.present[index] + studentData.bar.absent[index] + studentData.bar.leave[index];
  }, 0);
  
  const totalPresent = studentData.bar.present.reduce((a, b) => a + b, 0);
  const totalAbsent = studentData.bar.absent.reduce((a, b) => a + b, 0);

  // Pie chart total

  return (
    <div className="space-y-6">
      {/* Pie Chart Card */}
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-5 sm:p-7 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-xl">
              <PieChart className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white">
                Attendance Distribution
              </h3>
              <p className="text-xs text-green-100/50">
                Overview of student attendance status
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 sm:p-7 flex items-center justify-center">
          <div className="w-full max-w-2xl mx-auto" style={{ height: '380px' }}>
            <Pie
              data={{
                labels: studentData.pie.labels,
                datasets: [{
                  data: studentData.pie.data,
                  backgroundColor: pieColors,
                  borderWidth: 0, // Explicitly set to 0 to remove all borders
                  hoverOffset: 20,
                }],
              }}
              options={pieOptions}
            />
          </div>
        </div>
        {/* Summary stats below pie chart */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 pt-3 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {studentData.pie.labels.map((label, index) => {
              return (
                <div key={label} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    
                    <span className="text-xs sm:text-sm text-green-100/60 font-medium">{label}</span>
                  </div>
                  <div 
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ color: pieColors[index] }}
                  >
                    {studentData.pie.data[index]}
                  </div>
                
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bar Chart Card */}
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-5 sm:p-7 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-xl">
              <BarChart3 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white">
                Attendance by Class
              </h3>
              <p className="text-xs text-green-100/50">
                Breakdown by class and section
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 sm:p-7 flex items-center justify-center">
          <div className="w-full max-w-3xl mx-auto" style={{ height: '400px' }}>
            <Bar
              data={{
                labels: studentData.bar.labels,
                datasets: [
                  {
                    label: 'Present',
                    data: studentData.bar.present,
                    backgroundColor: '#4ade80',
                    borderRadius: 6,
                    maxBarThickness: 80,
                    barPercentage: 0.85,
                    categoryPercentage: 0.9,
                    borderSkipped: false,
                  },
                  {
                    label: 'Absent',
                    data: studentData.bar.absent,
                    backgroundColor: '#f87171',
                    borderRadius: 6,
                    maxBarThickness: 80,
                    barPercentage: 0.85,
                    categoryPercentage: 0.9,
                    borderSkipped: false,
                  },
                  {
                    label: 'Leave',
                    data: studentData.bar.leave,
                    backgroundColor: '#facc15',
                    borderRadius: 6,
                    maxBarThickness: 80,
                    barPercentage: 0.85,
                    categoryPercentage: 0.9,
                    borderSkipped: false,
                  },
                ],
              }}
              options={barOptions}
            />
          </div>
        </div>
        {/* Summary stats below bar chart */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 pt-3 border-t border-white/10">
          <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-xs text-green-100/50 mb-1">Total Classes</div>
              <div className="text-2xl sm:text-3xl font-bold text-yellow-300">
                {studentData.bar.labels.length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-green-100/50 mb-1">Total Students</div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {totalStudents}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-green-100/50 mb-1">Total Present</div>
              <div className="text-2xl sm:text-3xl font-bold text-green-400">
                {totalPresent}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-green-100/50 mb-1">Total Absent</div>
              <div className="text-2xl sm:text-3xl font-bold text-red-400">
                {totalAbsent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}