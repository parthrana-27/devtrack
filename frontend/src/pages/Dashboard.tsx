import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Payment Gateway', total: 40, completed: 24, overdue: 5 },
  { name: 'Auth Service', total: 30, completed: 13, overdue: 2 },
  { name: 'Frontend Refactor', total: 20, completed: 18, overdue: 0 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Active Projects</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">3</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Open Issues</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-brand-600">35</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Completed This Week</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">12</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Overdue Issues</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-red-600">7</dd>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Project Overview</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="Total Issues" fill="#8884d8" />
              <Bar dataKey="completed" name="Completed" fill="#14b8a6" />
              <Bar dataKey="overdue" name="Overdue" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
