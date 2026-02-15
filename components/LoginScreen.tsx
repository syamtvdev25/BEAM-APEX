
import React, { useState } from 'react';
import { useAuth } from '../App';
import { AuthState } from '../types';

const ApexLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 240 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M110 20C135 5 175 10 195 35" stroke="#F37021" strokeWidth="3" strokeLinecap="round" fill="none" />
    <g id="truck-cab">
      <path d="M78 72V58C78 54 81 52 84 52H108L122 58V72H78Z" fill="#00599F" />
      <path d="M108 52H122V72H108V52Z" fill="#003366" />
      <path d="M82 56H105V65H82V56Z" fill="#B0C4DE" fillOpacity="0.4" />
      <rect x="76" y="68" width="46" height="4" fill="#111827" />
    </g>
    <g id="trailer">
      <rect x="122" y="38" width="75" height="34" fill="#003366" />
      <text x="132" y="62" fill="white" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="16">APEX</text>
    </g>
    <g fill="#111827">
      <circle cx="86" cy="74" r="4.5" /><circle cx="104" cy="74" r="4.5" />
      <circle cx="138" cy="74" r="4.5" /><circle cx="152" cy="74" r="4.5" />
      <circle cx="178" cy="74" r="4.5" /><circle cx="192" cy="74" r="4.5" />
    </g>
    <g transform="translate(0, 5)">
      <text x="92" y="88" fill="#00599F" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="20">APEX</text>
      <text x="110" y="98" fill="#002D5A" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9" style={{ letterSpacing: '1px' }}>E-COM</text>
    </g>
  </svg>
);

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
        setError('Network error: Unable to connect to the server. This may be due to CORS restrictions, Mixed Content blocking (HTTP vs HTTPS), or an unreachable server.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please check your connection.');
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
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Apex-Ecom</h1>
            <p className="text-gray-400 font-medium mt-1">Sign in to your account</p>
          </div>
          <ApexLogo className="h-16 w-auto" />
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
            {isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </span>
            ) : 'Sign In'}
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
