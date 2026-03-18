import { useState } from 'react';
import { User, LogOut, ChevronDown, Play, Pause } from 'lucide-react';
import { useStore } from '@/store';
import { useEngine } from '@/hooks/useSimulation';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout, isEngineActive } = useStore();
  const { startEngine, stopEngine } = useEngine();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleEngine = () => {
    if (isEngineActive) {
      stopEngine();
    } else {
      startEngine();
    }
  };

  return (
    <header className="h-16 bg-white border-b border-black flex items-center justify-between px-6">
      {/* Left - Page Title placeholder */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">
          FulfillOS / AUTONOMOUS ENGINE
        </span>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-4">
        {/* Engine Toggle */}
        <button
          onClick={toggleEngine}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
            isEngineActive
              ? 'border-black bg-black text-white'
              : 'border-black bg-white text-black hover:bg-gray-50'
          }`}
        >
          {isEngineActive ? (
            <>
              <Pause className="w-3 h-3 fill-white" />
              <span>Engine Online</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-black" />
              <span>Start Engine</span>
            </>
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 hover:border-black transition-colors"
          >
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{user?.name || 'User'}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-black shadow-lg z-50">
              <div className="px-4 py-3 border-b border-black">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
