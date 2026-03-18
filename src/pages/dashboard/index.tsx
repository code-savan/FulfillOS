import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import type { OrderStatus } from '@/types';


const statusColors: Record<OrderStatus, string> = {
  pending: 'border-gray-300 bg-gray-100 text-gray-700',
  picking: 'border-black bg-black text-white',
  packing: 'border-gray-600 bg-gray-600 text-white',
  shipped: 'border-gray-300 bg-white text-gray-700',
  exception: 'border-red-600 bg-red-100 text-red-800'
};

const logTypeColors: Record<string, string> = {
  order: 'bg-black',
  inventory: 'bg-gray-500',
  staff: 'bg-gray-400',
  system: 'bg-gray-300'
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { orders, items, staff, logs, currentWarehouseId, setCurrentWarehouse } = useStore();

  const filteredOrders = orders.filter(o => o.warehouseId === currentWarehouseId);
  const filteredItems = items.filter(i => i.warehouseId === currentWarehouseId);
  const filteredStaff = staff.filter(s => s.warehouseId === currentWarehouseId);

  // Calculate KPIs
  const ordersToday = filteredOrders.filter(o => {
    const today = new Date();
    const orderDate = new Date(o.createdAt);
    return today.toDateString() === orderDate.toDateString();
  }).length;

  const fulfillmentRate = filteredOrders.length > 0 
    ? Math.round((filteredOrders.filter(o => o.status === 'shipped').length / filteredOrders.length) * 100) 
    : 0;

  const activeStaff = filteredStaff.filter(s => s.status === 'active').length;
  const lowStockCount = filteredItems.filter(i => i.stock <= i.minStock).length;

  const kpis = [
    { label: 'Node Orders', value: ordersToday.toString(), change: 12 },
    { label: 'Fulfillment Rate', value: `${fulfillmentRate}%`, change: 3.2 },
    { label: 'Node Staff', value: `${activeStaff}/${filteredStaff.length}`, change: 0 },
    { label: 'Low Stock SKUs', value: lowStockCount.toString(), change: -2 },
  ];

  const recentOrders = filteredOrders.slice(0, 5);
  const recentLogs = logs.slice(0, 8);

  const pipelineColumns: { status: OrderStatus; title: string; count: number }[] = [
    { status: 'pending', title: 'Pending', count: filteredOrders.filter(o => o.status === 'pending').length },
    { status: 'picking', title: 'Picking', count: filteredOrders.filter(o => o.status === 'picking').length },
    { status: 'packing', title: 'Packing', count: filteredOrders.filter(o => o.status === 'packing').length },
    { status: 'shipped', title: 'Shipped', count: filteredOrders.filter(o => o.status === 'shipped').length },
  ];

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
                        Commander's <br/><span className="text-gray-400 uppercase">Dashboard</span>
                    </h2>
                    <p className="max-w-xl text-sm font-medium leading-relaxed italic text-gray-500">
                        "Welcome to the Command Center. This page gives you a bird's-eye view of your entire warehouse operations. The autonomous engine is currently managing staff and processing orders to maximize throughput."
                    </p>
                </div>
                
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setCurrentWarehouse('WH-01')}
                            className={`px-4 py-2 border-2 border-black font-black uppercase text-[10px] transition-all ${currentWarehouseId === 'WH-01' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
                        >
                            Node 01
                        </button>
                        <button 
                            onClick={() => setCurrentWarehouse('WH-02')}
                            className={`px-4 py-2 border-2 border-black font-black uppercase text-[10px] transition-all ${currentWarehouseId === 'WH-02' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
                        >
                            Node 02
                        </button>
                    </div>
                    
                    {/* Engine Health Dial */}
                    <div className="border border-black p-4 min-w-[240px] bg-gray-50 flex flex-col items-center justify-center text-center">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-3 h-3 rounded-full animate-pulse ${useStore.getState().isEngineActive ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Engine Status</span>
                        </div>
                        <div className="text-2xl font-black uppercase tracking-tighter">
                            {useStore.getState().isEngineActive ? 'Autonomous' : 'Manual Mode'}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-widest">Heartbeat: {useStore.getState().engineConfig.speedMultiplier}x Intelligence</p>
                    </div>
                </div>
            </div>

            {/* KPI Strip (INTRO - BOLD) */}
            <div className="grid grid-cols-4 gap-0 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {kpis.map((kpi, index) => (
                <div
                  key={kpi.label}
                  className={`p-8 ${index < 3 ? 'border-r-4 border-black' : ''} hover:bg-gray-50 transition-colors cursor-default group`}
                >
                  <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-3 group-hover:text-black transition-colors">
                    {kpi.label}
                  </div>
                  <div className="flex items-end gap-3 flex-wrap">
                    <span className="text-4xl font-black tracking-tighter">{kpi.value}</span>
                    {kpi.change !== 0 && (
                      <span className={`text-xs mb-1 font-bold px-1.5 py-0.5 border ${kpi.change > 0 ? 'bg-black text-white' : 'bg-red-500 text-white'}`}>
                        {kpi.change > 0 ? '+' : ''}{kpi.change}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-6">
              {/* Live Orders Feed */}
              <div className="col-span-2 border border-black bg-white">
                <div className="px-4 py-3 border-b border-black bg-gray-50 flex items-center justify-between">
                  <h2 className="font-black text-[10px] uppercase tracking-widest text-gray-400 italic">Live Orders Feed</h2>
                  <button
                    onClick={() => navigate('/orders')}
                    className="text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors underline decoration-black/20"
                  >
                    View All →
                  </button>
                </div>
                <div className="divide-y divide-black max-h-[400px] overflow-auto custom-scrollbar">
                  {recentOrders.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-400 text-xs uppercase font-black italic">
                      No orders yet.
                    </div>
                  ) : (
                    recentOrders.map((order) => (
                      <div key={order.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs font-black">{order.id}</span>
                          <span className="text-sm font-black uppercase tracking-tighter">{order.customer}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-0.5 text-[10px] uppercase font-black border ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                          <span className="font-mono text-sm font-black">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Activity Logs */}
              <div className="border border-black bg-white">
                <div className="px-4 py-3 border-b border-black bg-gray-50">
                  <h2 className="font-black text-[10px] uppercase tracking-widest text-gray-400 italic">Activity Logs</h2>
                </div>
                <div className="max-h-[400px] overflow-auto custom-scrollbar">
                  {recentLogs.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-400 text-xs uppercase font-black italic">
                      No activity yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {recentLogs.map((log) => (
                        <div key={log.id} className="px-4 py-3 hover:bg-gray-50 transition-all">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${logTypeColors[log.type] || 'bg-gray-300'}`} />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-xs font-black uppercase tracking-tighter">{log.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fulfillment Pipeline */}
            <div className="border border-black bg-white">
              <div className="px-4 py-3 border-b border-black bg-gray-50 flex items-center justify-between">
                <h2 className="font-black text-[10px] uppercase tracking-widest text-gray-400 italic">Fulfillment Pipeline</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Global Capacity:</span>
                  <span className="font-mono text-xs font-black">{orders.length}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 divide-x divide-black">
                {pipelineColumns.map((column) => (
                  <div key={column.status} className="p-4 bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-black uppercase tracking-tighter">{column.title}</span>
                      <span className="font-mono text-lg font-black">{column.count}</span>
                    </div>
                    <div className="space-y-2">
                      {filteredOrders
                        .filter(o => o.status === column.status)
                        .slice(0, 3)
                        .map(order => (
                          <div
                            key={order.id}
                            className={`p-2 border border-gray-200 text-[10px] font-black uppercase tracking-tighter bg-gray-50/50 ${order.isVIP ? 'border-yellow-400 bg-yellow-50' : ''}`}
                          >
                            <div className="font-mono text-gray-400">{order.id}</div>
                            <div className="truncate">{order.customer}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
