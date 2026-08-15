import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, LogOut, CheckSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'My Issues', href: '/issues', icon: CheckSquare },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col bg-white border-r border-gray-200 md:flex">
        <div className="flex h-16 flex-shrink-0 items-center px-6">
          <h1 className="text-xl font-bold text-brand-600">DevTrack</h1>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-brand-700' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
          <button
            onClick={logout}
            className="group block w-full flex-shrink-0 rounded-md bg-white p-2 hover:bg-gray-50 text-left text-sm font-medium text-gray-700"
          >
            <div className="flex items-center">
              <LogOut className="inline-block h-5 w-5 text-gray-400 group-hover:text-gray-500 mr-3" />
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
