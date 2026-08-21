import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Payment Gateway', total: 40, completed: 24, overdue: 5 },
  { name: 'Auth Service', total: 30, completed: 13, overdue: 2 },
  { name: 'Frontend Refactor', total: 20, completed: 18, overdue: 0 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-2xl glass-dark px-4 py-5 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:-translate-y-1 transition-all duration-300 sm:p-6 animate-slide-up" style={{ animationDelay: '0ms' }}>
          <dt className="truncate text-sm font-medium text-gray-400">Total Active Projects</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-white">3</dd>
        </div>
        <div className="overflow-hidden rounded-2xl glass-dark px-4 py-5 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:-translate-y-1 transition-all duration-300 sm:p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <dt className="truncate text-sm font-medium text-gray-400">Open Issues</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-cyan-blue">35</dd>
        </div>
        <div className="overflow-hidden rounded-2xl glass-dark px-4 py-5 hover:shadow-[0_0_20px_rgba(52,211,153,0.2)] hover:-translate-y-1 transition-all duration-300 sm:p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <dt className="truncate text-sm font-medium text-gray-400">Completed This Week</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-emerald">12</dd>
        </div>
        <div className="overflow-hidden rounded-2xl glass-dark px-4 py-5 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:-translate-y-1 transition-all duration-300 sm:p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <dt className="truncate text-sm font-medium text-gray-400">Overdue Issues</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-red-500">7</dd>
        </div>
      </div>

      <div className="rounded-2xl glass-dark p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
        <h2 className="text-lg font-medium text-white mb-4">Project Overview</h2>
        <div className="h-80 w-full text-gray-300">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#181B22', border: '1px solid #ffffff1a', color: '#fff' }} />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Bar dataKey="total" name="Total Issues" fill="#8B5CF6" />
              <Bar dataKey="completed" name="Completed" fill="#34D399" />
              <Bar dataKey="overdue" name="Overdue" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
