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
  const { orders, items, staff, logs } = useStore();

  // Calculate KPIs
  const ordersToday = orders.filter(o => {
    const today = new Date();
    const orderDate = new Date(o.createdAt);
    return today.toDateString() === orderDate.toDateString();
  }).length;

  const fulfillmentRate = orders.length > 0 
    ? Math.round((orders.filter(o => o.status === 'shipped').length / orders.length) * 100) 
    : 0;

  const activeStaff = staff.filter(s => s.status === 'active').length;
  const lowStockCount = items.filter(i => i.stock <= i.minStock).length;

  const kpis = [
    { label: 'Orders Today', value: ordersToday.toString(), change: 12 },
    { label: 'Fulfillment Rate', value: `${fulfillmentRate}%`, change: 3.2 },
    { label: 'Active Staff', value: `${activeStaff}/${staff.length}`, change: 0 },
    { label: 'Low Stock SKUs', value: lowStockCount.toString(), change: -2 },
  ];

  const recentOrders = orders.slice(0, 5);
  const recentLogs = logs.slice(0, 8);

  const pipelineColumns: { status: OrderStatus; title: string; count: number }[] = [
    { status: 'pending', title: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { status: 'picking', title: 'Picking', count: orders.filter(o => o.status === 'picking').length },
    { status: 'packing', title: 'Packing', count: orders.filter(o => o.status === 'packing').length },
    { status: 'shipped', title: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
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

            {/* KPI Strip */}
            <div className="grid grid-cols-4 gap-0 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
              <div className="col-span-2 border border-black">
                <div className="px-4 py-3 border-b border-black bg-gray-50 flex items-center justify-between">
                  <h2 className="font-semibold text-sm">Live Orders Feed</h2>
                  <button
                    onClick={() => navigate('/orders')}
                    className="text-xs text-gray-500 hover:text-black transition-colors"
                  >
                    View All →
                  </button>
                </div>
                <div className="divide-y divide-black">
                  {recentOrders.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      No orders yet. Start simulation to generate orders.
                    </div>
                  ) : (
                    recentOrders.map((order) => (
                      <div key={order.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-sm">{order.id}</span>
                          <span className="text-sm">{order.customer}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 text-xs border ${statusColors[order.status]}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <span className="font-mono text-sm">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Activity Logs */}
              <div className="border border-black">
                <div className="px-4 py-3 border-b border-black bg-gray-50">
                  <h2 className="font-semibold text-sm">Activity Logs</h2>
                </div>
                <div className="max-h-80 overflow-auto">
                  {recentLogs.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      No activity yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {recentLogs.map((log) => (
                        <div key={log.id} className="px-4 py-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 ${logTypeColors[log.type]}`} />
                            <span className="text-xs text-gray-400">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm">{log.message}</p>
                          {log.details && (
                            <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fulfillment Pipeline */}
            <div className="border border-black">
              <div className="px-4 py-3 border-b border-black bg-gray-50 flex items-center justify-between">
                <h2 className="font-semibold text-sm">Fulfillment Pipeline</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Total Orders:</span>
                  <span className="font-mono text-sm">{orders.length}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 divide-x divide-black">
                {pipelineColumns.map((column) => (
                  <div key={column.status} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium">{column.title}</span>
                      <span className="font-mono text-lg font-bold">{column.count}</span>
                    </div>
                    <div className="space-y-2">
                      {orders
                        .filter(o => o.status === column.status)
                        .slice(0, 5)
                        .map(order => (
                          <div
                            key={order.id}
                            className="p-2 bg-gray-50 border border-gray-200 text-xs"
                          >
                            <div className="font-mono">{order.id}</div>
                            <div className="text-gray-500 truncate">{order.customer}</div>
                          </div>
                        ))}
                      {column.count > 5 && (
                        <div className="text-xs text-gray-400 text-center py-1">
                          +{column.count - 5} more
                        </div>
                      )}
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
