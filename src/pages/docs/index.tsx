import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { Layout, List, Users, Package, ShieldAlert, CheckCircle } from 'lucide-react';

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
            <section className="bg-black text-white p-12 shadow-[12px_12px_0px_0px_rgba(31,41,55,1)]">
              <div className="flex items-start gap-8">
                <div className="shrink-0 w-16 h-16 border-2 border-white flex items-center justify-center font-black text-2xl">01</div>
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold uppercase tracking-widest">The "Start Engine" Concept</h2>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Instead of manually managing every person and paper trail, you simply **"Start the Engine."** 
                    Our system takes full control of your orders, automatically assigning them to the right staff member at the right time across all nodes (warehouses).
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-2">
                      <h4 className="font-bold text-yellow-500 flex items-center gap-2 underline uppercase tracking-tighter">Automatic Labor Calculations</h4>
                      <p className="text-sm text-gray-400 font-medium">The engine tracks the exact second a picker starts and finishes a task. It then calculates your **Labor Burn** and **Gross Margin** automatically, so you know exactly how profitable each shipment is.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-yellow-500 flex items-center gap-2 underline uppercase tracking-tighter">Multi-Warehouse Routing</h4>
                      <p className="text-sm text-gray-400 font-medium">Got more than one location? The engine automatically routes orders to the warehouse (Node) closest to the customer to save you on shipping transit costs.</p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-black/5">
                  <div className="md:col-span-1 space-y-4">
                    <div className="w-12 h-12 border-2 border-black flex items-center justify-center rounded-lg">
                      <Layout className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold uppercase">Dashboard</h3>
                    <p className="text-sm text-gray-400 font-black uppercase tracking-widest italic">"The Global Command Center"</p>
                  </div>
                  <div className="md:col-span-2 text-gray-700 leading-relaxed font-medium">
                    The health of your entire network in one screen. Switch between **Node 01 (North)** and **Node 02 (West)** to see local activity. View your "Live Revenue" and the "Engine Heartbeat" to ensure the warehouse is humming correctly.
                  </div>
                </div>

                {/* Orders */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-black/5">
                  <div className="md:col-span-1 space-y-4">
                    <div className="w-12 h-12 border-2 border-black flex items-center justify-center rounded-lg">
                      <List className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold uppercase">Orders Ledger</h3>
                    <p className="text-sm text-gray-400 font-black uppercase tracking-widest italic">"Stable selection system"</p>
                  </div>
                  <div className="md:col-span-2 text-gray-700 leading-relaxed font-medium">
                    We've split the view to make your life easier. The **Master Ledger** is a stable list where you can find any order without it jumping around. The **Live Flow** is the fast-moving heart of the warehouse where you watch the robotics and staff handle shipments in real-time.
                  </div>
                </div>

                {/* Inventory */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-black/5">
                  <div className="md:col-span-1 space-y-4">
                    <div className="w-12 h-12 border-2 border-black flex items-center justify-center rounded-lg">
                      <Package className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold uppercase">Stock Integrity</h3>
                    <p className="text-sm text-gray-400 font-black uppercase tracking-widest italic">"Predictive Analytics"</p>
                  </div>
                  <div className="md:col-span-2 text-gray-700 leading-relaxed font-medium">
                    The engine gives you **"Runway Days"** for your stock. Instead of just a quantity, it tells you exactly when you will run out based on current sales speed. High-accuracy tracking prevents you from overselling and disappointing your clients.
                  </div>
                </div>

                {/* Picker Mode */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-black/5">
                  <div className="md:col-span-1 space-y-4">
                    <div className="w-12 h-12 border-2 border-black flex items-center justify-center rounded-lg bg-black text-white">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold uppercase">Picker Mode</h3>
                    <p className="text-sm text-gray-400 font-black uppercase tracking-widest italic">"Staff Smartphone View"</p>
                  </div>
                  <div className="md:col-span-2 text-gray-700 leading-relaxed font-medium">
                    Your staff can use our dedicated **Mobile Interface**. It acts as a handheld scanner that guides them to the exact aisle (e.g., A-12) and requires a "Scan SKU" confirmation before an item can be marked as picked—eliminating picking errors by 99%.
                  </div>
                </div>

                {/* Audit Trail */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-black/5 pb-12">
                  <div className="md:col-span-1 space-y-4">
                    <div className="w-12 h-12 border-2 border-black flex items-center justify-center rounded-lg">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold uppercase">Activity Audit</h3>
                    <p className="text-sm text-gray-400 font-black uppercase tracking-widest italic">"Every Decision Logged"</p>
                  </div>
                  <div className="md:col-span-2 text-gray-700 leading-relaxed font-medium">
                    The Engine keeps a **Detailed Audit Trail**. You can click any event to see its "Extended Metadata." This is perfect for insurance purposes or resolving disputes, as it shows the "Execution Trace" of exactly what happened during fulfillment.
                  </div>
                </div>

              </div>
            </section>

            {/* Profits & Efficiency - THE BOTTOM LINE */}
            <section className="bg-white border-4 border-black p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] space-y-12">
              <div className="space-y-4">
                <h2 className="text-5xl font-black uppercase tracking-tighter leading-none underline decoration-8 underline-offset-8">
                    The Bottom Line: <br/><span className="text-gray-400">Profit Maximization</span>
                </h2>
                <p className="text-lg font-medium text-gray-500 italic">
                    "FulfillOS isn't just software; it's a profit-generating machine. Every feature below is designed to lower your 'Burn Rate' and increase your 'Gross Margin'."
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-4 border-l-4 border-black pl-8">
                  <h4 className="font-black text-xl uppercase tracking-widest">01 / Zero-Waste Labor</h4>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    Most warehouses lose 15-20% of their payroll to "Walking Time"—staff looking for their next task. Our **Autonomous Engine** pushes the next task to their smartphone before they've even finished the current one. **Idle time is eliminated.**
                  </p>
                </div>
                <div className="space-y-4 border-l-4 border-black pl-8">
                  <h4 className="font-black text-xl uppercase tracking-widest">02 / Predictive Inventory</h4>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    Dead stock is a cash killer. Our **Runway Days** technology tells you when to liquidate slow-moving items and exactly when to reorder high-velocity items, freeing up thousands in locked-up capital.
                  </p>
                </div>
                <div className="space-y-4 border-l-4 border-black pl-8">
                  <h4 className="font-black text-xl uppercase tracking-widest">03 / Smart Batch Routing</h4>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    The Engine's **Geo-Intelligence** automatically routes shipments to the "Node" closest to the customer. This can save an average of **$1.40 per box** in transit costs alone—adding up to massive monthly savings.
                  </p>
                </div>
                <div className="space-y-4 border-l-4 border-black pl-8">
                  <h4 className="font-black text-xl uppercase tracking-widest">04 / Return-Kill Mode</h4>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    Incorrect shipments are the hidden cost of e-commerce. By requiring **Digital SKU Verification** in the Picker Mode, we stop errors before the box is taped shut. No more "wrong item" returns.
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t-2 border-dashed border-gray-200">
                <div className="bg-gray-50 p-6 flex items-center justify-between border-2 border-black">
                    <div className="text-sm font-black uppercase tracking-widest">Estimated ROI for High Volume User</div>
                    <div className="text-3xl font-black text-green-600">+$12.4k / MON</div>
                </div>
              </div>
            </section>

            {/* Who is this for? */}
            <section className="bg-black text-white p-12 shadow-[12px_12px_0px_0px_rgba(75,85,99,1)] space-y-12">
                <h2 className="text-4xl font-black uppercase tracking-tighter">Who is FulfillOS For?</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
                    <div className="space-y-4">
                        <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black">A</div>
                        <h4 className="font-bold uppercase tracking-widest text-yellow-500">Multi-Warehouse Owners</h4>
                        <p className="text-gray-400 font-medium leading-relaxed">
                            If you manage inventory across multiple regions (e.g., North and West Nodes), you need an "Engine" to make routing decisions for you. We handle the complexity of multi-site logistics.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black">B</div>
                        <h4 className="font-bold uppercase tracking-widest text-yellow-500">Scale-Ready E-commerce</h4>
                        <p className="text-gray-400 font-medium leading-relaxed">
                            For brands doing 500 to 5,000 orders per day. Our system is designed to handle "Holiday Spikes" (5x volume) without you needing to hire more administrative staff.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black">C</div>
                        <h4 className="font-bold uppercase tracking-widest text-yellow-500">Efficiency-First Managers</h4>
                        <p className="text-gray-400 font-medium leading-relaxed">
                            Managers who want to see their **Gross Margin** and **Labor Burn** in real-time. If you believe "you can't manage what you don't measure," FulfillOS is your primary weapon.
                        </p>
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
                <div className="space-y-2 font-medium">
                  <h4 className="font-bold flex items-center gap-2 uppercase tracking-tighter leading-none"><CheckCircle className="w-4 h-4" /> MARK AS VIP</h4>
                  <p className="text-gray-500">Force the Engine to prioritize a specific client. This temporarily halts other work to ensure your best customers get 5-minute shipment processing.</p>
                </div>
                <div className="space-y-2 font-medium">
                  <h4 className="font-bold flex items-center gap-2 uppercase tracking-tighter leading-none"><CheckCircle className="w-4 h-4" /> ENGINE SPEED</h4>
                  <p className="text-gray-500">Use the Settings to "Speed Up" the internal clock. This is used for stress-testing your warehouse capacity during peak seasons without hiring more staff yet.</p>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
