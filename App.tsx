
import React, { useState, createContext, useContext, useCallback, useEffect } from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, AppContextType } from './types';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import PCScreen from './components/PCScreen';
import PCModelsScreen from './components/PCModelsScreen';
import PCBrandsScreen from './components/PCBrandsScreen';
import CVScreen from './components/CVScreen';
import AxlesScreen from './components/AxlesScreen';
import EnginesScreen from './components/EnginesScreen';
import DescriptionSearchScreen from './components/DescriptionSearchScreen';
import BearingsScreen from './components/BearingsScreen';
import BatteriesScreen from './components/BatteriesScreen';
import ImportScreen from './components/ImportScreen';
import SearchScreen from './components/SearchScreen';
import ItemDetailsScreen from './components/ItemDetailsScreen';
import ItemQueryScreen from './components/ItemQueryScreen';
import { loginApi } from './api/authApi';

// Auth Context for simple state management
const AuthContext = createContext<AppContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Restore session on startup
  useEffect(() => {
    const savedUser = sessionStorage.getItem('apex_user');
    const savedToken = sessionStorage.getItem('apex_token');
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to restore session", e);
        sessionStorage.removeItem('apex_user');
        sessionStorage.removeItem('apex_token');
      }
    }
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await loginApi(username, password);
      
      if (response.success && response.token) {
        const userData: User = {
          username: username,
          customerCode: response.customerCode || '',
          customerName: response.customerName || '',
          country: response.country || '',
          userType: response.userType || '',
          token: response.token
        };

        // Persist session
        sessionStorage.setItem('apex_token', response.token);
        sessionStorage.setItem('apex_user', JSON.stringify(userData));
        
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      // Propagate error to let the UI handle specific messaging
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('apex_token');
    sessionStorage.removeItem('apex_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <MemoryRouter initialEntries={['/login']}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <LoginScreen /> : <Navigate to="/dashboard" replace />} 
            />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><SearchScreen /></ProtectedRoute>} />
            <Route path="/item-details/:itemCode/:brand/:imageType" element={<ProtectedRoute><ItemDetailsScreen /></ProtectedRoute>} />
            <Route path="/pc" element={<ProtectedRoute><PCScreen /></ProtectedRoute>} />
            <Route path="/pc-models/:manufacturer" element={<ProtectedRoute><PCModelsScreen /></ProtectedRoute>} />
            <Route path="/pc-brands/:manufacturer/:model" element={<ProtectedRoute><PCBrandsScreen /></ProtectedRoute>} />
            <Route path="/cv" element={<ProtectedRoute><CVScreen /></ProtectedRoute>} />
            <Route path="/axles" element={<ProtectedRoute><AxlesScreen /></ProtectedRoute>} />
            <Route path="/engines" element={<ProtectedRoute><EnginesScreen /></ProtectedRoute>} />
            <Route path="/description-search" element={<ProtectedRoute><DescriptionSearchScreen /></ProtectedRoute>} />
            <Route path="/item-query" element={<ProtectedRoute><ItemQueryScreen /></ProtectedRoute>} />
            <Route path="/bearings" element={<ProtectedRoute><BearingsScreen /></ProtectedRoute>} />
            <Route path="/batteries" element={<ProtectedRoute><BatteriesScreen /></ProtectedRoute>} />
            <Route path="/import" element={<ProtectedRoute><ImportScreen /></ProtectedRoute>} />
            
            <Route 
              path="*" 
              element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
            />
          </Routes>
        </div>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

export default App;
