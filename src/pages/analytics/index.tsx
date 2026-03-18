import { useNavigate } from 'react-router-dom';
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
import { TrendingUp, Package, Users, Clock } from 'lucide-react';
import { useStore } from '@/store';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';


export default function AnalyticsPage() {
  const navigate = useNavigate();
  const { orders, staff } = useStore();

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
  const totalOrders = orders.length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const avgFulfillmentTime = 42; // minutes
  const staffUtilization = Math.round((staff.filter(s => s.status === 'active').length / staff.length) * 100);

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-sm text-gray-500 mt-1">Operational performance metrics</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-0 border border-black">
              <div className="p-6 border-r border-black">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Total Orders</span>
                </div>
                <div className="text-3xl font-bold font-mono">{totalOrders}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {shippedOrders} shipped ({Math.round((shippedOrders / totalOrders) * 100) || 0}%)
                </div>
              </div>
              <div className="p-6 border-r border-black">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Avg Fulfillment</span>
                </div>
                <div className="text-3xl font-bold font-mono">{avgFulfillmentTime}m</div>
                <div className="text-xs text-gray-500 mt-1">End-to-end</div>
              </div>
              <div className="p-6 border-r border-black">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Staff Utilization</span>
                </div>
                <div className="text-3xl font-bold font-mono">{staffUtilization}%</div>
                <div className="text-xs text-gray-500 mt-1">Currently active</div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Throughput</span>
                </div>
                <div className="text-3xl font-bold font-mono">{Math.round(shippedOrders / 7)}/day</div>
                <div className="text-xs text-gray-500 mt-1">7-day average</div>
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
                  const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
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
