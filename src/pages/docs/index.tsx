import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { Layout, List, Users, Package, Settings, ShieldAlert, CheckCircle } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar />
        
        <main className="flex-1 overflow-auto bg-gray-50 border-l border-black">
          <div className="max-w-5xl mx-auto px-8 py-20 space-y-24">
            
            {/* Hero Section */}
            <div className="space-y-6">
              <h1 className="text-6xl font-black tracking-tighter text-black uppercase leading-none">
                Business Owner's <br/> <span className="text-gray-400">Operation Manual</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-medium">
                FulfillOS is an autonomous fulfillment engine designed to save you time and prevent costly human mistakes in your warehouse.
              </p>
            </div>

            <hr className="border-t-4 border-black w-24" />

            {/* The Engine Concept */}
            <section className="bg-black text-white p-12 shadow-[8px_8px_0px_0px_rgba(156,163,175,1)]">
              <div className="flex items-start gap-8">
                <div className="shrink-0 w-16 h-16 border-2 border-white flex items-center justify-center font-black text-2xl">01</div>
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold uppercase tracking-widest">The "Start Engine" Concept</h2>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Instead of manually managing every person and paper trail, you simply **"Start the Engine."** 
                    Our system takes full control of your orders, automatically assigning them to the right staff member at the right time.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-2">
                      <h4 className="font-bold text-yellow-400 flex items-center gap-2 underline">PREVENTS HUMAN ERROR</h4>
                      <p className="text-sm text-gray-300">The engine knows exactly what is in stock. It won't let a picker look for an item that isn't there.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-yellow-400 flex items-center gap-2 underline">SAVES ADMIN TIME</h4>
                      <p className="text-sm text-gray-300">No more manual assignment. The engine detects who is idle and pushes the highest priority work to them instantly.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Page Guide */}
            <section className="space-y-12">
              <h2 className="text-4xl font-black uppercase tracking-tighter">Your Control Center Guide</h2>
              
              <div className="grid grid-cols-1 gap-16">
                
                {/* Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 space-y-4">
                    <div className="w-12 h-12 border-2 border-black flex items-center justify-center rounded-lg">
                      <Layout className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold uppercase">Dashboard</h3>
                    <p className="text-sm text-gray-500 italic">"The Bird's Eye View"</p>
                  </div>
                  <div className="md:col-span-2 text-gray-700 leading-relaxed">
                    The health of your business in one screen. Use this to see how many orders are going out today, check your staff efficiency, and spot stock levels that are dangerously low.
                  </div>
                </div>

                {/* Orders */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 space-y-4">
                    <div className="w-12 h-12 border-2 border-black flex items-center justify-center rounded-lg">
                      <List className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold uppercase">Orders</h3>
                    <p className="text-sm text-gray-500 italic">"Autonomous Workflow Tracker"</p>
                  </div>
                  <div className="md:col-span-2 text-gray-700 leading-relaxed">
                    Watch the Engine move orders from **Pending** to **Shipped** in real-time. 
                    If the system detects a problem (like a damaged item), it will flag a **"System Anomaly"** (red border) so you can step in only when needed.
                  </div>
                </div>

                {/* Inventory */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 space-y-4">
                    <div className="w-12 h-12 border-2 border-black flex items-center justify-center rounded-lg">
                      <Package className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold uppercase">Inventory</h3>
                    <p className="text-sm text-gray-500 italic">"Stock & Compliance"</p>
                  </div>
                  <div className="md:col-span-2 text-gray-700 leading-relaxed">
                    The Engine keeps your stock levels 100% accurate. When an item is "Picked," the count is reduced instantly. You get a alert when you need to reorder.
                  </div>
                </div>

                {/* Staff */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 space-y-4">
                    <div className="w-12 h-12 border-2 border-black flex items-center justify-center rounded-lg">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold uppercase">Staff</h3>
                    <p className="text-sm text-gray-500 italic">"Human Capital Management"</p>
                  </div>
                  <div className="md:col-span-2 text-gray-700 leading-relaxed">
                    See who is working and who is idle. If you have too many "Packers" sitting around, you can reassign them to "Pickers" with one click to keep the workflow moving.
                  </div>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 space-y-4">
                    <div className="w-12 h-12 border-2 border-black flex items-center justify-center rounded-lg">
                      <Settings className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold uppercase">Engine Controls</h3>
                    <p className="text-sm text-gray-500 italic">"Dialing In Growth"</p>
                  </div>
                  <div className="md:col-span-2 text-gray-700 leading-relaxed">
                    This is where you sync with **Shopify** or **FedEx**. You can also "Overclock" the engine to see how your warehouse would handle 5x more orders during the holidays.
                  </div>
                </div>

              </div>
            </section>

            {/* Quick Intervention */}
            <section className="border-4 border-dashed border-red-600 p-8 space-y-6">
              <h2 className="text-3xl font-black uppercase text-red-600 flex items-center gap-3">
                <ShieldAlert className="w-8 h-8" />
                Emergency Interventions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div className="space-y-2">
                  <h4 className="font-bold flex items-center gap-2"><CheckCircle className="w-4 h-4" /> MARK AS VIP</h4>
                  <p>In the Orders page, click any order to mark it as VIP. The Engine will immediately stop other work and force a staff member to prioritize this client.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold flex items-center gap-2"><CheckCircle className="w-4 h-4" /> ENGINE TOGGLE</h4>
                  <p>In the top bar, you can stop the Engine at any time. This pauses all automated assignments if you need to perform a manual inventory count.</p>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
