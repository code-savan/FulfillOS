import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, CheckCircle, Clock, Circle, TrendingUp, Package } from 'lucide-react';
import { useStore } from '@/store';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import type { StaffRole, StaffStatus } from '@/types';


const statusConfig: Record<StaffStatus, { icon: typeof Circle; color: string; label: string }> = {
  active: { icon: CheckCircle, color: 'text-black', label: 'Active' },
  idle: { icon: Clock, color: 'text-gray-500', label: 'Idle' },
  offline: { icon: Circle, color: 'text-gray-300', label: 'Offline' }
};

export default function StaffPage() {
  const [roleFilter, setRoleFilter] = useState<StaffRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StaffStatus | 'all'>('all');
  const { staff, orders, updateStaffStatus, addLog } = useStore();

  const filteredStaff = staff.filter(s => {
    const matchesRole = roleFilter === 'all' || s.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesRole && matchesStatus;
  });

  const handleStatusChange = (staffId: string, newStatus: StaffStatus) => {
    updateStaffStatus(staffId, newStatus);
    const staffMember = staff.find(s => s.id === staffId);
    addLog('staff', `${staffMember?.name} is now ${newStatus}`);
  };

  const getStaffCurrentOrder = (staffId: string) => {
    return orders.find(o => o.assignedTo === staffId && o.status !== 'shipped');
  };

  const stats = {
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    idle: staff.filter(s => s.status === 'idle').length,
    offline: staff.filter(s => s.status === 'offline').length,
    totalCompleted: staff.reduce((sum, s) => sum + s.ordersCompleted, 0),
    avgEfficiency: Math.round(staff.reduce((sum, s) => sum + s.efficiency, 0) / staff.length || 0),
    burnRate: staff.filter(s => s.status !== 'offline').reduce((sum, s) => sum + s.hourlyRate, 0)
  };

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar />
        
        <main className="flex-1 p-6 overflow-auto bg-gray-50 border-l border-black">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Quick Context / Helper */}
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-start justify-between gap-8">
                <div className="space-y-4">
                    <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
                        Human <br/><span className="text-gray-400 uppercase">Capital</span>
                    </h2>
                    <p className="max-w-xl text-sm font-medium leading-relaxed italic text-gray-500">
                        "Your staff are the hands of the Engine. This page monitors real-time efficiency and task assignments. You can dynamically swap roles (e.g., Picker to Packer) to clear bottlenecks as they happen."
                    </p>
                </div>
                
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <div className="p-4 border-2 border-black bg-white flex flex-col items-center justify-center">
                    <TrendingUp className="w-6 h-6 mb-2 text-black" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Total Efficiency</span>
                    <span className="text-2xl font-black tracking-tighter">{stats.avgEfficiency}%</span>
                  </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-5 gap-0 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
              <div className="p-4 border-r-4 border-black">
                <div className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">Total Staff</div>
                <div className="text-3xl font-black">{stats.total}</div>
              </div>
              <div className="p-4 border-r-4 border-black">
                <div className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest text-green-600">Active Hand</div>
                <div className="text-3xl font-black">{stats.active}</div>
              </div>
              <div className="p-4 border-r-4 border-black bg-gray-50">
                <div className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest text-red-500">Hourly Burn</div>
                <div className="text-3xl font-black font-mono">${stats.burnRate}/hr</div>
              </div>
              <div className="p-4 border-r-4 border-black">
                <div className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">Global Output</div>
                <div className="text-3xl font-black font-mono">{stats.totalCompleted}</div>
              </div>
              <div className="p-4 bg-black text-white">
                <div className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest text-gray-500">Efficiency Index</div>
                <div className="text-3xl font-black">{stats.avgEfficiency}%</div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as StaffRole | 'all')}
                className="px-4 py-2 border border-black text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">All Roles</option>
                <option value="picker">Pickers</option>
                <option value="packer">Packers</option>
                <option value="supervisor">Supervisors</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StaffStatus | 'all')}
                className="px-4 py-2 border border-black text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="idle">Idle</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-3 gap-4">
              {filteredStaff.map((member) => {
                const status = statusConfig[member.status];
                const currentOrder = getStaffCurrentOrder(member.id);
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-black p-5 hover:border-gray-600 transition-colors"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 border border-black flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <select
                            value={member.role}
                            onChange={(e) => {
                              useStore.getState().updateStaffRole(member.id, e.target.value as StaffRole);
                              addLog('staff', `Role of ${member.name} changed to ${e.target.value}`);
                            }}
                            className="text-xs text-gray-500 bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-black transition-colors"
                          >
                            <option value="picker">Picker</option>
                            <option value="packer">Packer</option>
                            <option value="supervisor">Supervisor</option>
                          </select>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 ${status.color}`}>
                        <StatusIcon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Current Task */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Current Task</div>
                      {currentOrder ? (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200">
                          <Package className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-mono">{currentOrder.id}</div>
                            <div className="text-xs text-gray-500">{currentOrder.status}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 italic">No active task</div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 border border-black/10 p-3 bg-gray-50/50">
                      <div>
                        <div className="text-[10px] font-black uppercase text-gray-400">Node / Rate</div>
                        <div className="font-mono font-bold text-xs">{member.warehouseId} • ${member.hourlyRate}/h</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase text-gray-400">Efficiency</div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-green-600" />
                          <span className="font-mono font-bold text-xs">{member.efficiency}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="flex gap-2">
                      {(['idle', 'active', 'offline'] as StaffStatus[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(member.id, s)}
                          disabled={member.status === s}
                          className={`flex-1 px-2 py-1.5 text-xs border transition-colors ${
                            member.status === s
                              ? 'bg-black text-white border-black'
                              : 'border-gray-300 hover:border-black hover:bg-gray-50'
                          }`}
                        >
                          {statusConfig[s].label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredStaff.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No staff members match your filters.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
