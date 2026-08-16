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
    <div className="flex h-screen bg-transparent">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col glass-dark border-r border-white/5 md:flex m-4 rounded-2xl shadow-2xl">
        <div className="flex h-16 flex-shrink-0 items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-300 to-brand-100">
              DevTrack
            </h1>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                      isActive ? 'text-brand-400' : 'text-gray-500 group-hover:text-gray-300'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-shrink-0 border-t border-white/5 p-4">
          <button
            onClick={logout}
            className="group block w-full flex-shrink-0 rounded-xl bg-white/5 p-3 hover:bg-white/10 transition-all text-left text-sm font-medium text-gray-300"
          >
            <div className="flex items-center">
              <LogOut className="inline-block h-5 w-5 text-gray-500 group-hover:text-brand-400 mr-3 transition-colors" />
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-8 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
