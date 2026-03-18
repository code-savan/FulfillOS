import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from '@/store';
import { generateInitialOrders, generateInventoryItems, generateStaff } from '@/lib/mockData';
import LandingPage from '@/pages/landing';
import AuthPage from '@/pages/auth';
import DashboardPage from '@/pages/dashboard';
import OrdersPage from '@/pages/orders';
import InventoryPage from '@/pages/inventory';
import StaffPage from '@/pages/staff';
import AnalyticsPage from '@/pages/analytics';
import LogsPage from '@/pages/logs';
import SettingsPage from '@/pages/settings';
import DocsPage from '@/pages/docs';
import { EngineProvider } from '@/hooks/useSimulation';

export type PageRoute = 'landing' | 'auth' | 'dashboard' | 'orders' | 'inventory' | 'staff' | 'analytics' | 'logs' | 'settings' | 'docs';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}

function App() {
  const { orders, items, staff, addOrder, addLog } = useStore();

  // Initialize mock data on first load
  useEffect(() => {
    if (orders.length === 0) {
      const initialOrders = generateInitialOrders(25);
      initialOrders.forEach(order => addOrder(order));
    }
    if (items.length === 0) {
      const inventoryItems = generateInventoryItems();
      useStore.setState({ items: inventoryItems });
    }
    if (staff.length === 0) {
      const staffMembers = generateStaff();
      useStore.setState({ staff: staffMembers });
    }
    if (orders.length === 0) {
      addLog('system', 'FulfillOS initialized', 'System ready for operations');
    }
  }, []);

  return (
    <EngineProvider>
      <div className="min-h-screen bg-white text-black">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/orders/*" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/inventory/*" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
            <Route path="/staff/*" element={<ProtectedRoute><StaffPage /></ProtectedRoute>} />
            <Route path="/analytics/*" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/logs/*" element={<ProtectedRoute><LogsPage /></ProtectedRoute>} />
            <Route path="/settings/*" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/docs/*" element={<ProtectedRoute><DocsPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </EngineProvider>
  );
}

export default App;
