import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, User, MapPin, Package } from 'lucide-react';
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

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-black text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                className="px-4 py-2 border border-black text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="picking">Picking</option>
                <option value="packing">Packing</option>
                <option value="shipped">Shipped</option>
                <option value="exception">Exception</option>
              </select>
            </div>

            {/* Orders Table */}
            <div className="border border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-black bg-gray-100 text-[10px] font-black uppercase tracking-widest">
                <div className="col-span-2">Ref ID</div>
                <div className="col-span-3">Entity / Customer</div>
                <div className="col-span-4 text-center">Engine State Mode</div>
                <div className="col-span-2 text-right">Valuation</div>
                <div className="col-span-1"></div>
              </div>
              <div className="divide-y divide-black">
                {filteredOrders.length === 0 ? (
                  <div className="px-4 py-12 text-center text-gray-400 text-xs uppercase font-bold">
                    No active processes in queue.
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const handler = staff.find(s => s.id === order.assignedTo);
                    const isProcessing = ['picking', 'packing'].includes(order.status);
                    
                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`grid grid-cols-12 gap-4 px-6 py-5 hover:bg-gray-50 cursor-pointer transition-all items-center border-l-4 ${order.status === 'exception' ? 'border-l-red-600' : order.isVIP ? 'border-l-yellow-400' : 'border-l-transparent'}`}
                      >
                        <div className="col-span-2 font-mono text-xs font-bold">{order.id}</div>
                        <div className="col-span-3">
                          <div className="text-sm font-bold flex items-center gap-2">
                            {order.customer}
                            {order.isVIP && <span className="px-1.5 py-0.5 bg-yellow-400 text-black text-[9px] font-black uppercase tracking-tighter rounded border border-black">VIP</span>}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono uppercase truncate">{order.email}</div>
                        </div>
                        <div className="col-span-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-end text-[10px] uppercase font-bold">
                              <span className={`${order.status === 'exception' ? 'text-red-600' : 'text-black'}`}>
                                {order.status === 'exception' ? '!! SYSTEM ANOMALY !!' : order.status}
                              </span>
                              {handler && (
                                <span className="text-gray-400">Handling BY: {handler.name}</span>
                              )}
                            </div>
                            
                            {/* Progress Indicator */}
                            {isProcessing ? (
                                <div className="w-full h-1.5 bg-gray-100 border border-black overflow-hidden relative">
                                    <motion.div 
                                        initial={{ width: '0%' }}
                                        animate={{ width: '100%' }}
                                        transition={{ 
                                            duration: (order.estDurationMinutes || 0.5) * 60 / useStore.getState().engineConfig.speedMultiplier,
                                            ease: 'linear'
                                        } as any}
                                        className="h-full bg-black"
                                    />
                                </div>
                            ) : (
                                <div className={`w-full h-1.5 border border-black ${order.status === 'shipped' ? 'bg-black' : order.status === 'exception' ? 'bg-red-600' : 'bg-transparent'}`} />
                            )}
                          </div>
                        </div>
                        <div className="col-span-2 text-right font-mono text-sm font-bold">
                          ${order.total.toFixed(2)}
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <ChevronRight className="w-4 h-4 text-black" />
                        </div>
                      </div>
                    );
                  })
                )}
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
