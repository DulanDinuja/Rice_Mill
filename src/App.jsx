import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';
import PrivateRoute from './routes/PrivateRoute';
import GamingSidebar from './components/layout/GamingSidebar';
import CyberNavbar from './components/layout/CyberNavbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RiceStock from './pages/RiceStock';
import PaddyStock from './pages/PaddyStock';
import Reports from './pages/Reports';
import Warehouse from './pages/Warehouse';
import Settings from './pages/Settings';

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FDFBF6] dark:bg-transparent">
      <GamingSidebar />
      <CyberNavbar />
      <main className="md:ml-64 pt-20 md:pt-24 px-4 md:px-6 pb-4 md:pb-6 bg-[#FDFBF6] dark:bg-transparent">
        {children}
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" /> : <Login />} 
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/rice-stock"
        element={
          <PrivateRoute>
            <AppLayout>
              <RiceStock />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/paddy-stock"
        element={
          <PrivateRoute>
            <AppLayout>
              <PaddyStock />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <AppLayout>
              <Reports />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/warehouse"
        element={
          <PrivateRoute>
            <AppLayout>
              <Warehouse />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SidebarProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                className: '',
                style: {
                  background: 'transparent',
                  color: 'inherit',
                  border: 'none',
                  padding: 0,
                  boxShadow: 'none'
                },
                success: {
                  style: {
                    background: '#FFFFFF',
                    color: '#263238',
                    border: '1px solid rgba(46, 125, 50, 0.3)',
                  },
                  iconTheme: {
                    primary: '#2E7D32',
                    secondary: '#FFFFFF'
                  },
                  className: 'dark:!bg-[rgba(26,26,46,0.9)] dark:!text-white dark:!border-[rgba(0,255,136,0.3)]'
                },
                error: {
                  style: {
                    background: '#FFFFFF',
                    color: '#263238',
                    border: '1px solid rgba(211, 47, 47, 0.3)',
                  },
                  iconTheme: {
                    primary: '#D32F2F',
                    secondary: '#FFFFFF'
                  },
                  className: 'dark:!bg-[rgba(26,26,46,0.9)] dark:!text-white dark:!border-[rgba(239,68,68,0.3)]'
                }
              }}
            />
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
