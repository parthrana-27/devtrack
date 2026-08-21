import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('DEVELOPER');
  
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        // Login flow
        const response = await api.post('/auth/login', { email, password });
        login(response.data.access_token);
        navigate('/');
      } else {
        // Register flow
        const response = await api.post('/auth/register', { 
          name, 
          email, 
          password, 
          role 
        });
        login(response.data.access_token);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (isLogin ? 'Login failed' : 'Registration failed'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 glass-dark p-10 rounded-2xl animate-fade-in relative overflow-hidden">
        {/* Decorative subtle glowing orb */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-electric-violet rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-blue rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>
        
        <div className="relative">
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-white">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-center text-sm text-gray-400 mt-2">
            {isLogin ? 'Sign in to access DevTrack' : 'Join the ultimate issue tracking platform'}
          </p>
        </div>
        <form className="mt-8 space-y-6 relative" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 backdrop-blur-sm p-3 rounded-xl border border-red-500/20 text-red-400 text-sm text-center animate-slide-up" style={{ animationDelay: '0ms' }}>
              {error}
            </div>
          )}
          
          <div className="space-y-5 rounded-md shadow-sm">
            {!isLogin && (
              <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                <label className="block text-sm font-medium text-gray-300 ml-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required={!isLogin}
                  className="mt-1 block w-full rounded-xl border border-white/10 bg-charcoal px-4 py-3 text-white placeholder-gray-500 focus:border-electric-violet focus:outline-none focus:ring-2 focus:ring-electric-violet/20 sm:text-sm transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <label className="block text-sm font-medium text-gray-300 ml-1">Email address</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-xl border border-white/10 bg-charcoal px-4 py-3 text-white placeholder-gray-500 focus:border-electric-violet focus:outline-none focus:ring-2 focus:ring-electric-violet/20 sm:text-sm transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
              <label className="block text-sm font-medium text-gray-300 ml-1">Password</label>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full rounded-xl border border-white/10 bg-charcoal px-4 py-3 text-white placeholder-gray-500 focus:border-electric-violet focus:outline-none focus:ring-2 focus:ring-electric-violet/20 sm:text-sm transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!isLogin && (
              <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
                <label className="block text-sm font-medium text-gray-300 ml-1">Role</label>
                <select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-white/10 bg-charcoal px-4 py-3 text-white focus:border-electric-violet focus:outline-none focus:ring-2 focus:ring-electric-violet/20 sm:text-sm transition-all"
                >
                  <option value="DEVELOPER">Developer</option>
                  <option value="PROJECT_MANAGER">Project Manager</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
            )}
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '500ms' }}>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-xl border border-transparent bg-electric-violet py-3 px-4 text-sm font-semibold text-white shadow-md hover:bg-electric-violet/90 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-electric-violet focus:ring-offset-2 transition-all duration-200"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </div>
          
          <div className="text-center text-sm animate-slide-up" style={{ animationDelay: '600ms' }}>
            <span className="text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              className="font-semibold text-cyan-blue hover:text-cyan-blue/80 transition-colors"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
