import GlassCard from '../components/ui/GlassCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const data = [
    { month: 'Jan', rice: 4000, paddy: 2400 },
    { month: 'Feb', rice: 3000, paddy: 1398 },
    { month: 'Mar', rice: 2000, paddy: 9800 },
    { month: 'Apr', rice: 2780, paddy: 3908 },
    { month: 'May', rice: 1890, paddy: 4800 },
    { month: 'Jun', rice: 2390, paddy: 3800 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-gaming font-bold text-gray-900 dark:text-white mb-2">Reports</h1>
        <p className="text-gray-600 dark:text-gray-400">Analytics and insights</p>
      </div>

      <GlassCard>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Stock Movement (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(46, 125, 50, 0.2)" className="dark:stroke-[rgba(255,255,255,0.1)]" />
            <XAxis dataKey="month" stroke="#2E7D32" className="dark:stroke-[#00FF88]" />
            <YAxis stroke="#2E7D32" className="dark:stroke-[#00FF88]" />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid rgba(46, 125, 50, 0.3)',
                borderRadius: '8px',
                color: '#263238'
              }}
              className="dark:[&>div]:!bg-[rgba(26,26,46,0.9)] dark:[&>div]:!border-[rgba(0,255,136,0.3)] dark:[&>div]:!text-white"
            />
            <Bar dataKey="rice" fill="#2E7D32" className="dark:fill-[#00FF88]" />
            <Bar dataKey="paddy" fill="#66BB6A" className="dark:fill-[#8A2BE2]" />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
};

export default Reports;
