import { 
  LayoutDashboard, 
  Package, 
  Boxes, 
  Users, 
  BarChart3, 
  FileText,
  Box,
  Settings,
  BookOpen,
  Smartphone
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { id: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Operational Health' },
  { id: '/orders', label: 'Engine Queue', icon: Package, desc: 'Live Fulfillment' },
  { id: '/inventory', label: 'Inventory', icon: Boxes, desc: 'Stock Integrity' },
  { id: '/staff', label: 'Human Capital', icon: Users, desc: 'Efficiency Hub' },
  { id: '/analytics', label: 'Intelligence', icon: BarChart3, desc: 'Growth Metrics' },
  { id: '/logs', label: 'Audit Trail', icon: FileText, desc: 'System Events' },
  { id: '/settings', label: 'Engine Controls', icon: Settings, desc: 'System Rules' },
  { id: '/picker', label: 'Picker Mode', icon: Smartphone, desc: 'Handheld Floor View' },
  { id: '/docs', label: 'Documentation', icon: BookOpen, desc: 'User Manual' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <>
      <aside className="w-64 bg-white border-r border-black flex flex-col h-screen fixed left-0 top-0 z-40">
        {/* Logo */}
        <div className="h-16 border-b border-black flex items-center px-6">
          <Box className="w-5 h-5 mr-2" />
          <span className="font-semibold text-sm tracking-tight">FulfillOS</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.id);
              return (
                <li key={item.id}>
                  <Link
                    to={item.id}
                    className={`w-full flex items-center gap-3 px-6 py-4 transition-all border-l-2 ${
                      isActive
                        ? 'bg-black text-white border-l-black'
                        : 'text-gray-600 hover:bg-gray-50 border-l-transparent'
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.5 : 1.5} />
                    <div className="flex flex-col">
                      <span className={`text-sm tracking-tight ${isActive ? 'font-bold underline decoration-white/30' : 'font-medium'}`}>{item.label}</span>
                      <span className={`text-[10px] uppercase font-bold tracking-tighter transition-colors ${isActive ? 'text-gray-400' : 'text-gray-400 group-hover:text-black'}`}>{item.desc}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Version */}
        <div className="border-t border-black px-6 py-4">
          <div className="text-xs text-gray-400">
            <div>System Version 1.0</div>
            <div className="mt-1">Demo Environment</div>
          </div>
        </div>
      </aside>
      <div className="w-64 shrink-0" />
    </>
  );
}
