
import React, { useState, createContext, useContext, useCallback, useEffect } from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SplashScreen } from '@capacitor/splash-screen';
import { User, AppContextType } from './types';
import { CartProvider } from './context/CartContext';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import EmployeeModulePage from './components/employee/EmployeeModulePage';
import EmployeeItemDetailsScreen from './components/employee/EmployeeItemDetailsScreen';
import EmployeeCriteriaScreen from './components/employee/EmployeeCriteriaScreen';
import EmployeePartsListScreen from './components/employee/EmployeePartsListScreen';
import EmployeeERPPage from './components/employee/EmployeeERPPage';
import ERPMetricDetail from './components/employee/ERPMetricDetail';
import ProductDetails from './components/employee/ProductDetails';
import ReplacementHistory from './components/employee/ReplacementHistory';
import ERPScreen from './components/ERPScreen';
import BackorderAvailabilityScreen from './components/BackorderAvailabilityScreen';
import CountryTurnoverReportScreen from './components/CountryTurnoverReportScreen';
import CountryTurnoverReportResultScreen from './components/CountryTurnoverReportResultScreen';
import TotalCustomerSalesScreen from './components/TotalCustomerSalesScreen';
import CustomerSalesSubgroupScreen from './components/CustomerSalesSubgroupScreen';
import TotalCustomerSalesByCountrySalesmanFilterScreen from './components/TotalCustomerSalesByCountrySalesmanFilterScreen';
import TotalCustomerSalesByCountrySalesmanResultScreen from './components/TotalCustomerSalesByCountrySalesmanResultScreen';
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
import CartPage from './components/CartPage';
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
    SplashScreen.hide().catch(() => {});

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
        const rawUserType = response.userType || 'CUSTOMER';
        const userData: User = {
          username,
          userId: username,
          customerCode: response.customerCode || '',
          customerName: response.customerName || '',
          displayName: response.customerName || username,
          country: response.country || '',
          userType: rawUserType.toUpperCase(),
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
      <CartProvider>
        <MemoryRouter initialEntries={['/login']}>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Routes>
              <Route 
                path="/login" 
                element={!user ? <LoginScreen /> : <Navigate to={user.userType === 'APEX' ? "/employee" : "/dashboard"} replace />} 
              />
              
              <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
              <Route path="/employee" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />

              {/* Employee Specific Module Routes */}
              <Route path="/employee/home" element={<ProtectedRoute><EmployeeModulePage title="HOME" /></ProtectedRoute>} />
              <Route path="/employee/pc" element={<ProtectedRoute><EmployeeModulePage title="PC" /></ProtectedRoute>} />
              <Route path="/employee/cv" element={<ProtectedRoute><EmployeeModulePage title="CV" /></ProtectedRoute>} />
              <Route path="/employee/axles" element={<ProtectedRoute><EmployeeModulePage title="Axles" /></ProtectedRoute>} />
              <Route path="/employee/engines" element={<ProtectedRoute><EmployeeModulePage title="Engines" /></ProtectedRoute>} />
              <Route path="/employee/apex-import" element={<ProtectedRoute><EmployeeModulePage title="Apex Import" /></ProtectedRoute>} />
              <Route path="/employee/magma-import" element={<ProtectedRoute><EmployeeModulePage title="Magma Import" /></ProtectedRoute>} />
              <Route path="/employee/part-no-oe" element={<ProtectedRoute><EmployeeModulePage title="Part No - OE" /></ProtectedRoute>} />
              <Route path="/employee/search-by-description" element={<ProtectedRoute><EmployeeModulePage title="Search By Description" /></ProtectedRoute>} />
              <Route path="/employee/batteries" element={<ProtectedRoute><EmployeeModulePage title="Batteries" /></ProtectedRoute>} />
              
              {/* Upgraded Replacement & Details Flow */}
              <Route path="/product/:artNr" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
              <Route path="/replacement/:artNr" element={<ProtectedRoute><ReplacementHistory /></ProtectedRoute>} />
              <Route path="/erp/:artNr" element={<ProtectedRoute><EmployeeERPPage /></ProtectedRoute>} />
              <Route path="/erp/metric/:type/:artNr" element={<ProtectedRoute><ERPMetricDetail /></ProtectedRoute>} />
              
              <Route path="/employee/item/:id" element={<ProtectedRoute><EmployeeItemDetailsScreen /></ProtectedRoute>} />
              <Route path="/employee/criteria" element={<ProtectedRoute><EmployeeCriteriaScreen /></ProtectedRoute>} />
              <Route path="/employee/parts-list" element={<ProtectedRoute><EmployeePartsListScreen /></ProtectedRoute>} />

              {/* Shared / Existing Routes */}
              <Route path="/erp" element={<ProtectedRoute><ERPScreen /></ProtectedRoute>} />
              <Route path="/backorder-list" element={<ProtectedRoute><BackorderAvailabilityScreen /></ProtectedRoute>} />
              <Route path="/country-turnover" element={<ProtectedRoute><CountryTurnoverReportScreen /></ProtectedRoute>} />
              <Route path="/country-turnover-report/result" element={<ProtectedRoute><CountryTurnoverReportResultScreen /></ProtectedRoute>} />
              <Route path="/customer-sales-country" element={<ProtectedRoute><TotalCustomerSalesScreen /></ProtectedRoute>} />
              <Route path="/customer-sales-country-salesman/filter" element={<ProtectedRoute><TotalCustomerSalesByCountrySalesmanFilterScreen /></ProtectedRoute>} />
              <Route path="/customer-sales-country-salesman/result" element={<ProtectedRoute><TotalCustomerSalesByCountrySalesmanResultScreen /></ProtectedRoute>} />
              <Route path="/customer-sales-subgroup" element={<ProtectedRoute><CustomerSalesSubgroupScreen /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchScreen /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
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
              
              <Route 
                path="*" 
                element={<Navigate to={user ? (user.userType === 'APEX' ? "/employee" : "/dashboard") : "/login"} replace />} 
              />
            </Routes>
          </div>
        </MemoryRouter>
      </CartProvider>
    </AuthContext.Provider>
  );
};

export default App;
