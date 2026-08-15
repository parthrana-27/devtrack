import { Link } from 'react-router-dom';

export default function Projects() {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 sm:w-auto">
            Create Project
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder Project Card */}
        <div className="relative flex flex-col items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2 hover:border-gray-400">
          <div className="min-w-0 flex-1">
            <Link to="/projects/1" className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-lg font-medium text-gray-900">Payment Gateway</p>
              <p className="truncate text-sm text-gray-500">PAY • 12 Active Issues</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
