import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Package, Clock, TrendingUp } from 'lucide-react';
import { useStore } from '@/store';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';


export default function AnalyticsPage() {
  const { 
    orders, 
    staff, 
    currentWarehouseId, 
    setCurrentWarehouse 
  } = useStore();

  // Generate orders over time data
  const ordersOverTime = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    return last7Days.map((day, index) => {
      const dayOrders = Math.floor(Math.random() * 50) + 150 + (index * 10);
      return { day, orders: dayOrders };
    });
  }, []);

  // Fulfillment speed data
  const fulfillmentSpeed = useMemo(() => [
    { stage: 'Pending→Picking', minutes: 12 },
    { stage: 'Picking', minutes: 18 },
    { stage: 'Picking→Packing', minutes: 8 },
    { stage: 'Packing', minutes: 15 },
    { stage: 'Packing→Shipped', minutes: 6 },
  ], []);

  // Staff productivity data
  const staffProductivity = useMemo(() => {
    return staff
      .sort((a, b) => b.ordersCompleted - a.ordersCompleted)
      .slice(0, 6)
      .map(s => ({
        name: s.name.split(' ')[0],
        orders: s.ordersCompleted,
        efficiency: s.efficiency
      }));
  }, [staff]);

  // Calculate metrics
  const filteredOrders = orders.filter(o => o.warehouseId === currentWarehouseId);
  const totalLaborCost = filteredOrders.reduce((sum, o) => sum + (o.laborCost || 0), 0);
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const avgFulfillmentTime = 38; // minutes

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
                        Operational <br/><span className="text-gray-400 uppercase">Growth Intelligence</span>
                    </h2>
                    <p className="max-w-xl text-sm font-medium leading-relaxed italic text-gray-500">
                        "Your fulfillment engine doesn't just move boxes; it generates data. Use these 'Growth Levers' to identify bottlenecks. The Labor Cost metric shows exactly where your human capital is being spent vs. the value it creates."
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <button 
                        onClick={() => setCurrentWarehouse('WH-01')}
                        className={`px-6 py-3 border-2 border-black font-black uppercase text-xs transition-all ${currentWarehouseId === 'WH-01' ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]' : 'bg-white text-black hover:bg-gray-50'}`}
                    >
                        WH-01: North Node
                    </button>
                    <button 
                        onClick={() => setCurrentWarehouse('WH-02')}
                        className={`px-6 py-3 border-2 border-black font-black uppercase text-xs transition-all ${currentWarehouseId === 'WH-02' ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]' : 'bg-white text-black hover:bg-gray-50'}`}
                    >
                        WH-02: West Node
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-0 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="p-6 border-r-4 border-black">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">Node Influx</span>
                </div>
                <div className="text-4xl font-black font-mono tracking-tighter">{filteredOrders.length}</div>
                <div className="text-[10px] font-black uppercase text-gray-400 mt-1">
                  Active in {currentWarehouseId}
                </div>
              </div>
              <div className="p-6 border-r-4 border-black bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">Avg Lead Time</span>
                </div>
                <div className="text-4xl font-black font-mono tracking-tighter">{avgFulfillmentTime}<span className="text-lg">m</span></div>
                <div className="text-[10px] font-black uppercase text-gray-400 mt-1">Pik+Pak Combined</div>
              </div>
              <div className="p-6 border-r-4 border-black">
                <div className="flex items-center gap-2 mb-2 text-red-500">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Labor Burn</span>
                </div>
                <div className="text-4xl font-black font-mono tracking-tighter text-red-600">${totalLaborCost.toFixed(2)}</div>
                <div className="text-[10px] font-black uppercase text-gray-400 mt-1">Accrued Operational Cost</div>
              </div>
              <div className="p-6 bg-green-50">
                <div className="flex items-center gap-2 mb-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Gross Margin</span>
                </div>
                <div className="text-4xl font-black font-mono tracking-tighter text-green-700">
                    {totalRevenue > 0 ? (Math.max(0, (totalRevenue - totalLaborCost) / totalRevenue * 100)).toFixed(1) : '0'}%
                </div>
                <div className="text-[10px] font-black uppercase text-green-600/50 mt-1">Efficiency adjusted</div>
              </div>
            </div>

            {/* Geo-Intelligence Node Map Mockup */}
            <div className="border-4 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-12">
                <div className="space-y-4 max-w-sm">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Geo-Intelligence <span className="text-gray-400">Map</span></h3>
                    <p className="text-sm text-gray-500 leading-relaxed italic">
                        "Your engine is multi-node. Our routing logic automatically directs shipments to the node closest to the customer to minimize transit burn."
                    </p>
                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-400">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-black rounded-sm"></div> WH-01 (Active)</div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-gray-200 rounded-sm"></div> WH-02 (Standby)</div>
                    </div>
                </div>
                <div className="flex-1 h-48 bg-gray-100 border-2 border-black relative overflow-hidden flex items-center justify-center">
                    {/* Mock map graphic */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                    <div className="relative w-full h-full flex items-center justify-center">
                        <svg viewBox="0 0 400 200" className="w-full h-full">
                            <path d="M50,150 Q100,50 150,150 T250,150" fill="none" stroke="#ddd" strokeWidth="2" strokeDasharray="4" />
                            <circle cx="80" cy="100" r="6" fill={currentWarehouseId === 'WH-01' ? 'black' : '#ccc'} />
                            <text x="70" y="85" fontSize="10" fontWeight="900" textAnchor="middle">WH-01 (NORTH)</text>
                            
                            <circle cx="320" cy="120" r="6" fill={currentWarehouseId === 'WH-02' ? 'black' : '#ccc'} />
                            <text x="330" y="105" fontSize="10" fontWeight="900" textAnchor="middle">WH-02 (WEST)</text>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Orders Over Time */}
              <div className="border border-black p-6">
                <h3 className="font-semibold mb-6">Orders Processed (7 Days)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ordersOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#000' }}
                        tickLine={{ stroke: '#000' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#000' }}
                        tickLine={{ stroke: '#000' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #000',
                          borderRadius: 0 
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="orders" 
                        stroke="#000" 
                        strokeWidth={2}
                        dot={{ fill: '#000', strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, fill: '#000' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Fulfillment Speed */}
              <div className="border border-black p-6">
                <h3 className="font-semibold mb-6">Fulfillment Speed by Stage</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fulfillmentSpeed} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis 
                        type="number"
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#000' }}
                        tickLine={{ stroke: '#000' }}
                        label={{ value: 'Minutes', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        type="category"
                        dataKey="stage"
                        tick={{ fontSize: 11 }}
                        axisLine={{ stroke: '#000' }}
                        tickLine={{ stroke: '#000' }}
                        width={100}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #000',
                          borderRadius: 0 
                        }}
                        formatter={(value: number) => [`${value} min`, 'Time']}
                      />
                      <Bar dataKey="minutes" fill="#000">
                        {fulfillmentSpeed.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#000' : '#444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Staff Productivity */}
              <div className="border border-black p-6">
                <h3 className="font-semibold mb-6">Staff Productivity (Orders Completed)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={staffProductivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis 
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#000' }}
                        tickLine={{ stroke: '#000' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#000' }}
                        tickLine={{ stroke: '#000' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #000',
                          borderRadius: 0 
                        }}
                      />
                      <Bar dataKey="orders" fill="#000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Efficiency Comparison */}
              <div className="border border-black p-6">
                <h3 className="font-semibold mb-6">Staff Efficiency (%)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={staffProductivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis 
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#000' }}
                        tickLine={{ stroke: '#000' }}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#000' }}
                        tickLine={{ stroke: '#000' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #000',
                          borderRadius: 0 
                        }}
                        formatter={(value: number) => [`${value}%`, 'Efficiency']}
                      />
                      <Bar dataKey="efficiency" fill="#666" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="border border-black p-6">
              <h3 className="font-semibold mb-4">Order Status Distribution</h3>
              <div className="grid grid-cols-4 gap-6">
                {[
                  { status: 'Pending', count: orders.filter(o => o.status === 'pending').length, color: 'bg-gray-200' },
                  { status: 'Picking', count: orders.filter(o => o.status === 'picking').length, color: 'bg-black' },
                  { status: 'Packing', count: orders.filter(o => o.status === 'packing').length, color: 'bg-gray-600' },
                  { status: 'Shipped', count: orders.filter(o => o.status === 'shipped').length, color: 'bg-gray-400' },
                ].map(({ status, count, color }) => {
                  const percentage = filteredOrders.length > 0 ? (count / filteredOrders.length) * 100 : 0;
                  return (
                    <div key={status} className="text-center">
                      <div className="text-3xl font-bold font-mono mb-1">{count}</div>
                      <div className="text-sm text-gray-500 mb-2">{status}</div>
                      <div className="h-2 bg-gray-100 w-full">
                        <div 
                          className={`h-full ${color}`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{percentage.toFixed(1)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
