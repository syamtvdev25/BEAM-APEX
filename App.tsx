
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
import CartSelectionScreen from './components/CartSelectionScreen';
import ItemDetailsScreen from './components/ItemDetailsScreen';
import ItemQueryScreen from './components/ItemQueryScreen';
import { loginApi } from './api/authApi';

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

  useEffect(() => {
    const savedToken = sessionStorage.getItem('apex_token');
    const savedAuthUser = localStorage.getItem('authUser');
    
    if (savedToken && savedAuthUser) {
      try {
        const parsedUser = JSON.parse(savedAuthUser) as User;
        setUser(parsedUser);
      } catch (e) {
        logout();
      }
    }
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await loginApi(username, password);
      if (response.success && response.token) {
        const userData: User = {
          username,
          userId: username,
          customerCode: response.customerCode || '',
          customerName: response.customerName || '',
          displayName: response.customerName || username,
          country: response.country || '',
          userType: response.userType || 'User',
          role: response.userType || 'User',
          token: response.token
        };
        sessionStorage.setItem('apex_token', response.token);
        localStorage.setItem('authUser', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('apex_token');
    localStorage.removeItem('authUser');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <MemoryRouter initialEntries={['/login']}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Routes>
            <Route path="/login" element={!user ? <LoginScreen /> : <Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><SearchScreen /></ProtectedRoute>} />
            <Route path="/cart-select" element={<ProtectedRoute><CartSelectionScreen /></ProtectedRoute>} />
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
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </div>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

export default App;
