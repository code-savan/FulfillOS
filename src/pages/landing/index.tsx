import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Box, Users, BarChart3, Zap, Check } from 'lucide-react';


export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="w-6 h-6" />
            <span className="text-lg font-semibold tracking-tight">FulfillOS</span>
          </div>
          <button
            onClick={() => navigate('/auth')}
            className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors text-sm font-medium"
          >
            Access Demo
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              Operational Control for
              <br />
              High-Volume Fulfillment
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
              Real-time visibility across orders, inventory, and warehouse execution. 
              Built for operators managing 7-figure monthly volumes.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/auth')}
                className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors text-sm font-medium flex items-center gap-2"
              >
                Access Demo
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="px-6 py-3 border border-black hover:bg-black hover:text-white transition-colors text-sm font-medium"
              >
                View System
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-12">System Capabilities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border border-black">
              {[
                {
                  icon: Zap,
                  title: 'Order Orchestration',
                  description: 'Automated order routing from intake to shipment with real-time status tracking'
                },
                {
                  icon: Box,
                  title: 'Inventory Sync',
                  description: 'Live stock levels across all SKUs with low-stock alerts and location mapping'
                },
                {
                  icon: Users,
                  title: 'Staff Coordination',
                  description: 'Task assignment and productivity tracking for pickers, packers, and supervisors'
                },
                {
                  icon: BarChart3,
                  title: 'Real-Time Analytics',
                  description: 'Operational KPIs, fulfillment metrics, and performance dashboards'
                }
              ].map((capability, index) => (
                <div
                  key={capability.title}
                  className={`p-8 ${index < 3 ? 'border-r border-black' : ''} ${index < 4 ? 'border-b md:border-b-0' : ''}`}
                >
                  <capability.icon className="w-8 h-8 mb-4" strokeWidth={1.5} />
                  <h3 className="text-lg font-semibold mb-2">{capability.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{capability.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* System Preview Section */}
      <section className="border-b border-black bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">System Preview</h2>
            <p className="text-gray-600 mb-12 max-w-2xl">
              A dense, information-rich interface designed for warehouse operators who need 
              complete visibility at a glance.
            </p>
            
            {/* Mock Dashboard Preview */}
            <div className="border-2 border-black bg-white overflow-hidden">
              {/* Mock Header */}
              <div className="border-b border-black px-4 py-3 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <Box className="w-5 h-5" />
                  <span className="font-semibold text-sm">FulfillOS</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Demo User</span>
                </div>
              </div>
              
              {/* Mock Content */}
              <div className="flex">
                {/* Mock Sidebar */}
                <div className="w-48 border-r border-black bg-gray-50 p-4 hidden md:block">
                  <div className="space-y-2">
                    {['Dashboard', 'Orders', 'Inventory', 'Staff', 'Analytics', 'Logs'].map((item, i) => (
                      <div
                        key={item}
                        className={`px-3 py-2 text-xs ${i === 0 ? 'bg-black text-white' : 'text-gray-600'}`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Mock Main Content */}
                <div className="flex-1 p-6">
                  {/* Mock KPIs */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Orders Today', value: '247' },
                      { label: 'Fulfillment Rate', value: '94.2%' },
                      { label: 'Active Staff', value: '8/8' },
                      { label: 'Low Stock', value: '3' }
                    ].map((kpi) => (
                      <div key={kpi.label} className="border border-black p-4">
                        <div className="text-xs text-gray-500 mb-1">{kpi.label}</div>
                        <div className="text-2xl font-bold">{kpi.value}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Mock Table */}
                  <div className="border border-black">
                    <div className="bg-gray-100 px-4 py-2 border-b border-black text-xs font-medium">
                      Recent Orders
                    </div>
                    <div className="divide-y divide-black">
                      {[
                        { id: 'ORD-A7X2K9', customer: 'Sarah Johnson', status: 'Picking', total: '$156.00' },
                        { id: 'ORD-B3M8P1', customer: 'Michael Chen', status: 'Packing', total: '$89.50' },
                        { id: 'ORD-C5R2T7', customer: 'Emily Davis', status: 'Pending', total: '$234.00' }
                      ].map((order) => (
                        <div key={order.id} className="px-4 py-3 flex justify-between items-center text-sm">
                          <div className="flex gap-8">
                            <span className="font-mono">{order.id}</span>
                            <span>{order.customer}</span>
                          </div>
                          <div className="flex gap-8 items-center">
                            <span className="px-2 py-1 bg-gray-100 text-xs">{order.status}</span>
                            <span className="font-mono">{order.total}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features List Section */}
      <section className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-6">Built for Scale</h2>
              <ul className="space-y-4">
                {[
                  'Process 10,000+ orders per day',
                  'Real-time inventory synchronization',
                  'Multi-warehouse support ready',
                  'Role-based access control',
                  'Complete audit trail logging',
                  'API-ready architecture'
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-6">Demo Credentials</h2>
              <div className="border border-black p-6 bg-gray-50">
                <p className="text-sm text-gray-600 mb-4">
                  Access the full system demo with these credentials:
                </p>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex gap-4">
                    <span className="text-gray-500 w-20">Email:</span>
                    <span>demo@fulfillos.com</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-500 w-20">Password:</span>
                    <span>password123</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/auth')}
                  className="mt-6 w-full px-4 py-3 bg-black text-white hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Launch Demo
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5" />
              <span className="font-semibold">FulfillOS</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
              <span>Enterprise Fulfillment OS</span>
              <span>Demo Version 1.0</span>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-xs text-gray-500">
            Built for demonstration purposes. Not for production use.
          </div>
        </div>
      </footer>
    </div>
  );
}
