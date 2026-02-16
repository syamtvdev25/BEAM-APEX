
import React, { useState } from 'react';
import { useAuth } from '../App';
import { AuthState } from '../types';
import { brandingConfig } from '../config/brandingConfig';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<AuthState>(AuthState.IDLE);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both fields');
      return;
    }

    setStatus(AuthState.LOADING);
    setError('');
    
    try {
      const success = await login(username, password);
      if (!success) {
        setStatus(AuthState.FAILURE);
        setError('Invalid username or password');
      }
    } catch (err: any) {
      setStatus(AuthState.FAILURE);
      if (err.message === 'CONNECTION_ERROR') {
        setError('Network error: Unable to connect to the server.');
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    }
  };

  const isLoading = status === AuthState.LOADING;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-8 relative overflow-hidden border border-gray-100">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">{brandingConfig.appName}</h1>
            <p className="text-gray-400 font-medium mt-1">Sign in to your account</p>
          </div>
          <div className="h-16 w-16 bg-slate-50 rounded-2xl p-2 flex items-center justify-center border border-slate-100 shadow-sm">
            <img 
              src={brandingConfig.logoPath} 
              alt={brandingConfig.appName} 
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4 relative z-10">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
            <input
              type="text"
              value={username}
              disabled={isLoading}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all outline-none text-gray-800 disabled:opacity-50"
              placeholder="Enter UserId"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input
              type="password"
              value={password}
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all outline-none text-gray-800 disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-[11px] font-black leading-tight animate-in fade-in slide-in-from-top-2 uppercase">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-5 px-4 rounded-2xl text-white font-bold shadow-lg transition-all active:scale-[0.98] ${
              isLoading ? 'bg-blue-300' : 'bg-blue-900 hover:bg-blue-950'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-tighter">
          <span>Enterprise Portal</span>
          <span className="opacity-50">v1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
