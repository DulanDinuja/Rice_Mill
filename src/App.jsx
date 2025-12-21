import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
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
    <div className="min-h-screen">
      <GamingSidebar />
      <CyberNavbar />
      <main className="ml-64 pt-16 p-6">
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
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(26, 26, 46, 0.9)',
                color: '#fff',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                backdropFilter: 'blur(10px)'
              },
              success: {
                iconTheme: {
                  primary: '#00FF88',
                  secondary: '#0A0A0A'
                }
              }
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
