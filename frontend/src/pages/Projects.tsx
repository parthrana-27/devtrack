import { Link } from 'react-router-dom';

export default function Projects() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 hover:scale-105 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 sm:w-auto">
            Create Project
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder Project Card */}
        <div className="relative flex flex-col items-center space-x-3 rounded-2xl glass px-6 py-5 focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2 hover:border-brand-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up cursor-pointer group">
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
