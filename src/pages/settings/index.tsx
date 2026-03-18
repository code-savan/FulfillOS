import { useStore } from '@/store';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { Settings, Sliders, Server, Zap } from 'lucide-react';

export default function SettingsPage() {
  const { engineConfig, updateEngineConfig, toggleIntegration } = useStore();

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar />
        
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          <div className="max-w-5xl mx-auto space-y-6">
            
            <div className="flex items-center gap-3 border-b border-black pb-4">
              <Settings className="w-8 h-8 text-black" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Engine Control Room</h1>
                <p className="text-sm text-gray-500">Master controls for autonomous fulfillment logic and third-party API hooks.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Engine Rules & Efficiency */}
              <div className="border border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="px-6 py-4 border-b border-black bg-gray-100 flex items-center gap-2">
                  <Sliders className="w-5 h-5" />
                  <h2 className="font-bold uppercase tracking-widest text-sm">Fulfillment Rules Engine</h2>
                </div>
                <div className="p-6 space-y-8">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-bold uppercase tracking-tighter">Engine Process Speed</label>
                      <span className="text-xs font-mono font-bold bg-black text-white px-2 py-0.5">{engineConfig.speedMultiplier}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" max="5" step="0.5"
                      value={engineConfig.speedMultiplier}
                      onChange={(e) => updateEngineConfig({ speedMultiplier: parseFloat(e.target.value) })}
                      className="w-full h-8 appearance-none cursor-pointer accent-black"
                    />
                    <p className="text-[10px] text-gray-400 mt-1 uppercase">Accelerates the internal clock for faster throughput testing.</p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-bold uppercase tracking-tighter">Order Influx Volume</label>
                      <span className="text-xs font-mono font-bold">{Math.round(engineConfig.orderRate * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" max="1" step="0.1"
                      value={engineConfig.orderRate}
                      onChange={(e) => updateEngineConfig({ orderRate: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gray-200 accent-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-black pt-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase block mb-2">Picker Velocity</label>
                      <input 
                        type="range" min="0" max="1" step="0.1"
                        value={engineConfig.pickingRate}
                        onChange={(e) => updateEngineConfig({ pickingRate: parseFloat(e.target.value) })}
                        className="w-full h-1 accent-black"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase block mb-2">Packer Velocity</label>
                      <input 
                        type="range" min="0" max="1" step="0.1"
                        value={engineConfig.packingRate}
                        onChange={(e) => updateEngineConfig({ packingRate: parseFloat(e.target.value) })}
                        className="w-full h-1 accent-black"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-black pt-6">
                    <div>
                      <label className="text-sm font-bold uppercase">Auto-Detect Anomalies</label>
                      <p className="text-[10px] text-gray-400 uppercase">Engine will flag suspicious orders for manual review.</p>
                    </div>
                    <button 
                      onClick={() => updateEngineConfig({ exceptionsEnabled: !engineConfig.exceptionsEnabled })}
                      className={`w-14 h-7 border-2 border-black transition-all relative ${engineConfig.exceptionsEnabled ? 'bg-black' : 'bg-white'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 border border-black transition-all ${engineConfig.exceptionsEnabled ? 'translate-x-7 bg-white' : 'translate-x-0 bg-black'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Bridges */}
              <div className="border border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="px-6 py-4 border-b border-black bg-gray-100 flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  <h2 className="font-bold uppercase tracking-widest text-sm">Data Bridges</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="border border-black p-5 flex items-center justify-between transition-all hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 border-2 border-black flex items-center justify-center font-black text-xl">S</div>
                      <div>
                        <h3 className="font-bold uppercase text-xs">Shopify OS Bridge</h3>
                        <p className="text-[10px] text-gray-500 uppercase mt-1">Direct ingest from primary sales channel</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleIntegration('shopify')}
                      className={`px-4 py-2 text-[10px] font-bold uppercase border-2 border-black transition-all ${engineConfig.activeIntegrations.includes('shopify') ? 'bg-black text-white' : 'bg-white text-black'}`}
                    >
                      {engineConfig.activeIntegrations.includes('shopify') ? 'Online' : 'Connect'}
                    </button>
                  </div>

                  <div className="border border-black p-5 flex items-center justify-between transition-all hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 border-2 border-black flex items-center justify-center font-black text-xl"><Zap className="w-6 h-6 fill-black"/></div>
                      <div>
                        <h3 className="font-bold uppercase text-xs">FedEx Prime Link</h3>
                        <p className="text-[10px] text-gray-500 uppercase mt-1">Automated label generation sync</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleIntegration('fedex')}
                      className={`px-4 py-2 text-[10px] font-bold uppercase border-2 border-black transition-all ${engineConfig.activeIntegrations.includes('fedex') ? 'bg-black text-white' : 'bg-white text-black'}`}
                    >
                      {engineConfig.activeIntegrations.includes('fedex') ? 'Online' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
