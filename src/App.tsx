import { useState, useEffect } from 'react';
import { AdminLayout } from './components/Admin/AdminLayout';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AdminOrders } from './components/Admin/AdminOrders';
import { AdminRevisionLog } from './components/Admin/AdminRevisionLog';
import { AdminCollections } from './components/Admin/AdminCollections';
import { AdminClients } from './components/Admin/AdminClients';
import { AdminSettings } from './components/Admin/AdminSettings';
import { AdminLogin } from './components/Admin/AdminLogin';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="size-12 border-4 border-admin-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {activeTab === 'dashboard' && <AdminDashboard />}
      {['orders', 'orders_top'].includes(activeTab) && <AdminOrders />}
      {activeTab === 'revisions' && <AdminRevisionLog orderId={null} />}
      {activeTab === 'collections' && <AdminCollections />}
      {activeTab === 'clients' && <AdminClients />}
      {activeTab === 'settings' && <AdminSettings />}
    </AdminLayout>
  );
}

export default App;
