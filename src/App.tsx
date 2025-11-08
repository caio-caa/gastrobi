import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { MenuProvider } from './contexts/MenuContext';
import { POSProvider } from './contexts/POSContext';
import { WhiteLabelProvider } from './contexts/WhiteLabelContext';

import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Loyalty from './pages/Loyalty';
import Campaigns from './pages/Campaigns';
import Menu from './pages/Menu';
import QRCodes from './pages/QRCodes';
import PublicMenu from './pages/PublicMenu';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import POS from './pages/POS';
import AdminUsers from './pages/AdminUsers';
import WhiteLabelAdmin from './pages/WhiteLabelAdmin';
import SaaSAnalytics from './pages/SaaSAnalytics';

import { useAuth } from './contexts/AuthContext';


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Verificar se é super admin (em produção, isso viria do banco)
  const isSuperAdmin = user?.email === 'admin@gastrobi.com';
  
  return user && isSuperAdmin ? <>{children}</> : <Navigate to="/dashboard" />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
      
      {/* Rotas públicas */}
      <Route path="/menu/:restaurantSlug" element={<PublicMenu />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      
      {/* Rota da landing page pública */}
      <Route path="/cardapio/:restaurantSlug" element={<PublicMenu />} />
      
      {/* Rota de administração SaaS */}
      <Route path="/admin/*" element={
        <AdminRoute>
          <Layout>
            <Routes>
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/white-label" element={<WhiteLabelAdmin />} />
              <Route path="/analytics" element={<SaaSAnalytics />} />
              <Route path="/" element={<Navigate to="/admin/users" />} />
            </Routes>
          </Layout>
        </AdminRoute>
      } />
      
      {/* Rotas protegidas */}
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              <Route path="/loyalty" element={<Loyalty />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/qr-codes" element={<QRCodes />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/pos" element={<POS />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <WhiteLabelProvider>
        <AuthProvider>
          <DataProvider>
            <MenuProvider>
              <POSProvider>
                <AppRoutes />
              </POSProvider>
            </MenuProvider>
          </DataProvider>
        </AuthProvider>
      </WhiteLabelProvider>
    </Router>
  );
}

export default App;