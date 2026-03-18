import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, User, MapPin, Package } from 'lucide-react';
import { useStore } from '@/store';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import type { Order, OrderStatus } from '@/types';


const statusColors: Record<OrderStatus, string> = {
  pending: 'border-gray-300 bg-gray-100 text-gray-700',
  picking: 'border-black bg-black text-white',
  packing: 'border-gray-600 bg-gray-600 text-white',
  shipped: 'border-gray-300 bg-white text-gray-700',
  exception: 'border-red-600 bg-red-100 text-red-800'
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { orders, staff, updateOrderStatus, assignOrder, updateStaffStatus, addLog, markOrderVIP } = useStore();

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    addLog('order', `Order ${orderId} status updated to ${newStatus}`);
  };

  const handleAssignStaff = (orderId: string, staffId: string) => {
    assignOrder(orderId, staffId);
    updateStaffStatus(staffId, 'active');
    const staffMember = staff.find(s => s.id === staffId);
    addLog('staff', `${staffMember?.name} assigned to order ${orderId}`);
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
                        Fulfillment <br/><span className="text-gray-400 uppercase">Engine Queue</span>
                    </h2>
                    <p className="max-w-xl text-sm font-medium leading-relaxed italic text-gray-500">
                        "Watch the Engine in action. Every line below represents a live customer order. The progress bars show real-time processing by your staff. Red flags indicate a 'System Anomaly' where the Engine needs your human expertise to resolve a conflict."
                    </p>
                </div>
                
                <div className="border border-black p-4 min-w-[200px] bg-gray-50 flex flex-col items-center justify-center text-center">
                    <div className="text-sm font-black uppercase tracking-widest text-gray-400 mb-1">Queue Depth</div>
                    <div className="text-3xl font-black font-mono">{orders.filter(o => o.status !== 'shipped').length}</div>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-widest">Active Processes</p>
                </div>
            </div>

            {/* Two-Pane Layout */}
            <div className="grid grid-cols-12 gap-6 items-start">
                
                {/* Left Pane: Master Order Ledger (Stable) */}
                <div className="col-span-8 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black uppercase tracking-tighter">Master Order Ledger</h3>
                            <span className="px-2 py-0.5 bg-black text-white text-[10px] font-black uppercase tracking-widest">Stable View</span>
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase italic">
                            * Records here are pinned for easy selection. User manual sync required for new batches.
                        </div>
                    </div>

                    {/* Filters Inside Ledger */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Locate entity by ID or Name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-2 border-black text-sm font-bold focus:outline-none bg-white"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                            className="px-4 py-2 border-2 border-black text-xs font-black uppercase focus:outline-none bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <option value="all">Total Archive</option>
                            <option value="pending">Awaiting Engine</option>
                            <option value="exception">System Anomalies</option>
                            <option value="shipped">Fulfillment Archive</option>
                        </select>
                    </div>

                    <div className="border border-black bg-white overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-black bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <div className="col-span-3">Entity ID</div>
                            <div className="col-span-5">Identity / Designation</div>
                            <div className="col-span-2 text-right">Valuation</div>
                            <div className="col-span-2 text-right">State</div>
                        </div>
                        <div className="divide-y divide-black max-h-[600px] overflow-auto custom-scrollbar">
                            {filteredOrders.length === 0 ? (
                                <div className="px-4 py-12 text-center text-gray-400 text-xs uppercase font-black italic">
                                    No records matching active filter.
                                </div>
                            ) : (
                                filteredOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        onClick={() => setSelectedOrder(order)}
                                        className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-black hover:text-white cursor-pointer transition-all items-center group ${order.status === 'exception' ? 'bg-red-50' : ''}`}
                                    >
                                        <div className="col-span-3 font-mono text-xs font-black">{order.id}</div>
                                        <div className="col-span-5">
                                            <div className="text-sm font-black uppercase tracking-tighter truncate group-hover:text-white">{order.customer}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase truncate group-hover:text-gray-300">{order.email}</div>
                                        </div>
                                        <div className="col-span-2 text-right font-mono text-sm font-black">
                                            ${order.total.toFixed(2)}
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase border border-current ${order.status === 'exception' ? 'text-red-600 border-red-600' : 'text-gray-400 border-gray-400 group-hover:text-white group-hover:border-white'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Pane: Live Engine Flow (Moving) */}
                <div className="col-span-4 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-black uppercase tracking-tighter">Engine Live Flow</h3>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    </div>

                    <div className="p-6 border border-black bg-black text-white space-y-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                            Orders currently being processed by the autonomous robotic core and warehouse staff.
                        </p>
                        
                        <div className="space-y-3 max-h-[640px] overflow-auto pr-2 custom-scrollbar">
                            {orders.filter(o => ['picking', 'packing'].includes(o.status)).length === 0 ? (
                                <div className="py-12 text-center border-2 border-dashed border-white/20 text-white/30 text-[10px] font-black uppercase italic">
                                    Engine IDLE. Awaiting input.
                                </div>
                            ) : (
                                orders
                                    .filter(o => ['picking', 'packing'].includes(o.status))
                                    .map((order) => {
                                        const handler = staff.find(s => s.id === order.assignedTo);
                                        return (
                                            <motion.div
                                                key={order.id}
                                                layout
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="p-4 bg-white/5 border border-white/10 space-y-3 relative overflow-hidden group"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="text-[10px] font-black text-gray-500 uppercase">{order.id}</div>
                                                        <div className="text-xs font-black uppercase tracking-tighter">{order.customer}</div>
                                                    </div>
                                                    <div className="px-2 py-0.5 bg-white text-black text-[9px] font-black uppercase">
                                                        {order.status}
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase">
                                                        <span>Processing State</span>
                                                        <span>{handler?.name || 'Allocating...'}</span>
                                                    </div>
                                                    <div className="w-full h-1 bg-white/10 overflow-hidden relative">
                                                        <motion.div 
                                                            initial={{ width: '0%' }}
                                                            animate={{ width: '100%' }}
                                                            transition={{ 
                                                                duration: (order.estDurationMinutes || 1) * 60 / useStore.getState().engineConfig.speedMultiplier,
                                                                ease: 'linear'
                                                            } as any}
                                                            className="h-full bg-white shadow-[0_0_8px_white]"
                                                        />
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedOrder(order);
                                                    }}
                                                    className="w-full py-2 bg-white/10 hover:bg-white hover:text-black text-[10px] font-black uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    Interrupt State
                                                </button>
                                            </motion.div>
                                        );
                                    })
                            )}
                        </div>
                    </div>

                    {/* Quick Stats / Node Health */}
                    <div className="p-5 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="text-[10px] font-black uppercase text-gray-400 mb-2">Node Efficiency</div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-black font-mono">
                                {Math.round(staff.reduce((acc, s) => acc + s.efficiency, 0) / staff.length)}%
                            </span>
                            <span className="text-[10px] font-bold text-green-600 uppercase mb-1">+2.4% OPTIMIZED</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </main>
      </div>

      {/* Order Detail Panel */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white border-l border-black shadow-xl z-50 overflow-auto"
          >
            <div className="sticky top-0 bg-white border-b border-black px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Order ID</div>
                <div className="flex items-center gap-3">
                  <div className="font-mono text-lg">{selectedOrder.id}</div>
                  {selectedOrder.isVIP && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs uppercase font-bold tracking-wider rounded border border-yellow-300">VIP</span>}
                </div>
              </div>

              {/* Admin Actions */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Admin Overrides</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                        markOrderVIP(selectedOrder.id);
                        setSelectedOrder({...selectedOrder, isVIP: true});
                    }}
                    disabled={selectedOrder.isVIP || selectedOrder.status === 'shipped'}
                    className={`px-3 py-1.5 text-xs border font-medium transition-colors ${selectedOrder.isVIP ? 'bg-yellow-100 text-yellow-800 border-yellow-300 cursor-not-allowed' : 'hover:bg-yellow-50 hover:border-yellow-400'}`}
                  >
                    {selectedOrder.isVIP ? 'VIP Status Active' : 'Mark as VIP'}
                  </button>
                  <button
                    onClick={() => {
                        handleStatusChange(selectedOrder.id, 'exception');
                        setSelectedOrder({...selectedOrder, status: 'exception'});
                    }}
                    disabled={selectedOrder.status === 'exception' || selectedOrder.status === 'shipped'}
                    className={`px-3 py-1.5 text-xs border font-medium transition-colors ${selectedOrder.status === 'exception' ? 'bg-red-100 text-red-800 border-red-300 cursor-not-allowed' : 'hover:bg-red-50 border-gray-300 text-gray-700 hover:text-red-700 hover:border-red-400'}`}
                  >
                    Flag Exception
                  </button>
                </div>
              </div>

              {/* Status */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Status</div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 text-sm border ${statusColors[selectedOrder.status]}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(['pending', 'picking', 'packing', 'shipped'] as OrderStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedOrder.id, status)}
                      disabled={selectedOrder.status === status}
                      className={`px-3 py-1 text-xs border transition-colors ${
                        selectedOrder.status === status
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'hover:bg-black hover:text-white'
                      }`}
                    >
                      Set {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Customer</div>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium">{selectedOrder.customer}</div>
                    <div className="text-sm text-gray-500">{selectedOrder.email}</div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Shipping Address</div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="text-sm">
                    <div>{selectedOrder.shippingAddress.street}</div>
                    <div>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}</div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Items</div>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border border-gray-200">
                      <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs">Qty: {item.quantity}</span>
                          <span className="font-mono text-sm">${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-black flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-mono text-xl font-bold">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Assignment */}
              {selectedOrder.status !== 'shipped' && (
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Assign Staff</div>
                  {selectedOrder.assignedTo ? (
                    <div className="text-sm">
                      Assigned to: <span className="font-medium">{staff.find(s => s.id === selectedOrder.assignedTo)?.name}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {staff
                        .filter(s => s.status === 'idle')
                        .slice(0, 3)
                        .map(s => (
                          <button
                            key={s.id}
                            onClick={() => handleAssignStaff(selectedOrder.id, s.id)}
                            className="w-full px-3 py-2 text-left text-sm border border-gray-300 hover:border-black hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span>{s.name}</span>
                              <span className="text-xs text-gray-500 capitalize">{s.role}</span>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Timestamp */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Created: {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
