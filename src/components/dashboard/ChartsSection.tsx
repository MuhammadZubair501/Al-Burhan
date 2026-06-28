import { ChartCard } from '../common/ChartCard';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import type { DashboardData } from '../../types/dashboard';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler
);

interface ChartsSectionProps {
  studentData: DashboardData['studentCharts'];
  teacherData: DashboardData['teacherCharts'];
}

export function ChartsSection({ studentData, teacherData }: ChartsSectionProps) {
  const pieColors = ['#4ade80', '#f87171', '#facc15'];

  const pieOptions = {
    plugins: { legend: { labels: { color: '#fff' } } },
  };

  const barOptions = {
    plugins: { legend: { labels: { color: '#fff' } } },
    scales: {
      x: { ticks: { color: '#ccc' } },
      y: { ticks: { color: '#ccc' } },
    },
  };

  const lineOptions = {
    plugins: { legend: { labels: { color: '#fff' } } },
    scales: {
      x: { ticks: { color: '#ccc' } },
      y: { ticks: { color: '#ccc' } },
    },
    elements: { line: { tension: 0.3 } },
  };

  const areaOptions = {
    ...lineOptions,
    elements: {
      line: { tension: 0.3 },
      point: { radius: 2 },
    },
    plugins: {
      ...lineOptions.plugins,
      filler: { propagate: false },
    },
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-white mb-4">Student Attendance Charts</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Pie Chart">
          <Pie
            data={{
              labels: studentData.pie.labels,
              datasets: [{ data: studentData.pie.data, backgroundColor: pieColors }],
            }}
            options={pieOptions}
          />
        </ChartCard>
        <ChartCard title="Bar Chart by Class">
          <Bar
            data={{
              labels: studentData.bar.labels,
              datasets: [
                { label: 'Present', data: studentData.bar.present, backgroundColor: '#4ade80' },
                { label: 'Absent', data: studentData.bar.absent, backgroundColor: '#f87171' },
                { label: 'Leave', data: studentData.bar.leave, backgroundColor: '#facc15' },
              ],
            }}
            options={barOptions}
          />
        </ChartCard>
        <ChartCard title="Stacked Bar Chart">
          <Bar
            data={{
              labels: studentData.stacked.labels,
              datasets: [
                { label: 'Present', data: studentData.stacked.present, backgroundColor: '#4ade80' },
                { label: 'Absent', data: studentData.stacked.absent, backgroundColor: '#f87171' },
                { label: 'Leave', data: studentData.stacked.leave, backgroundColor: '#facc15' },
              ],
            }}
            options={{
              ...barOptions,
              scales: { x: barOptions.scales.x, y: { ...barOptions.scales.y, stacked: true } },
            }}
          />
        </ChartCard>
        <ChartCard title="Line Chart (Last 30 Days)">
          <Line
            data={{
              labels: studentData.line.labels,
              datasets: [{ label: 'Attendance %', data: studentData.line.data, borderColor: '#4ade80', fill: false }],
            }}
            options={lineOptions}
          />
        </ChartCard>
        <ChartCard title="Area Chart (Monthly Trend)">
          <Line
            data={{
              labels: studentData.area.labels,
              datasets: [{ label: 'Attendance %', data: studentData.area.data, borderColor: '#4ade80', backgroundColor: 'rgba(74, 222, 128, 0.3)', fill: true }],
            }}
            options={areaOptions}
          />
        </ChartCard>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">Teacher Attendance Charts</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Pie Chart">
          <Pie
            data={{
              labels: teacherData.pie.labels,
              datasets: [{ data: teacherData.pie.data, backgroundColor: pieColors }],
            }}
            options={pieOptions}
          />
        </ChartCard>
        <ChartCard title="Bar Chart by Department">
          <Bar
            data={{
              labels: teacherData.bar.labels,
              datasets: [{ label: 'Attendance %', data: teacherData.bar.data, backgroundColor: '#60a5fa' }],
            }}
            options={barOptions}
          />
        </ChartCard>
        <ChartCard title="Line Chart">
          <Line
            data={{
              labels: teacherData.line.labels,
              datasets: [{ label: 'Attendance %', data: teacherData.line.data, borderColor: '#60a5fa', fill: false }],
            }}
            options={lineOptions}
          />
        </ChartCard>
        <ChartCard title="Area Chart">
          <Line
            data={{
              labels: teacherData.area.labels,
              datasets: [{ label: 'Attendance %', data: teacherData.area.data, borderColor: '#60a5fa', backgroundColor: 'rgba(96, 165, 250, 0.3)', fill: true }],
            }}
            options={areaOptions}
          />
        </ChartCard>
      </div>
    </div>
  );
}