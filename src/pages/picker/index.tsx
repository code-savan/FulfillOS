import { useState } from 'react';
import { useStore } from '@/store';
import { MapPin, CheckCircle, Smartphone, User, History, Boxes, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function PickerPage() {
  const navigate = useNavigate();
  const { orders, staff, currentWarehouseId } = useStore();
  
  // Mock current logged in staff for this mobile view
  const currentStaff = staff.find(s => s.role === 'picker' && s.warehouseId === currentWarehouseId && s.status !== 'offline') || staff[0];
  const activeOrder = orders.find(o => o.assignedTo === currentStaff.id && ['picking', 'packing'].includes(o.status));

  const [scanStep, setScanStep] = useState(0); // 0: Start, 1: Scan Bin, 2: Scan Product, 3: Done

  const handleNextStep = () => {
    if (scanStep < 3) {
      setScanStep(s => s + 1);
    } else {
      // Logic would actually happen in Engine, but for this mock UI:
      setScanStep(0);
    }
  };

  if (!activeOrder) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="w-24 h-24 bg-gray-900 border border-gray-800 flex items-center justify-center rounded-3xl mb-8 animate-pulse text-gray-500">
            <Smartphone className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">No Active Tasks</h1>
        <p className="text-gray-500 text-sm max-w-xs leading-relaxed uppercase font-bold tracking-widest">
            The engine is currently routing new shipments. You will be alerted when a batch is ready.
        </p>
        <div className="mt-12 space-y-4 flex flex-col items-center">
            <button 
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white/90 active:scale-95 transition-all"
            >
                Return to Command Center
            </button>
            <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-700 uppercase">
                <User className="w-3 h-3" />
                Signed in as: {currentStaff.name} / {currentWarehouseId}
            </div>
        </div>
      </div>
    );
  }

  const currentItem = activeOrder.items[0];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans flex flex-col">
      {/* Handheld Header */}
      <header className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white hover:text-black transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-[10px] uppercase font-black tracking-widest text-gray-500 leading-none mb-1">Active Batch</h2>
                    <span className="font-mono text-sm">{activeOrder.id}</span>
                </div>
            </div>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-black tracking-widest">
                {activeOrder.status}
            </div>
      </header>

      {/* Main Flow Area */}
      <main className="flex-1 flex flex-col p-6 space-y-8">
        
        {/* Step Indicator */}
        <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= scanStep ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]' : 'bg-white/10'}`} />
            ))}
        </div>

        <div className="flex-1 flex flex-col justify-center gap-8">
            <AnimatePresence mode="wait">
                {scanStep === 0 && (
                    <motion.div 
                        key="loc"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-4 text-gray-400">
                            <MapPin className="w-6 h-6" />
                            <span className="text-sm uppercase font-black tracking-widest italic">Locate Destination</span>
                        </div>
                        <div className="text-7xl font-black tracking-tighter text-white">
                            A-12
                        </div>
                        <p className="text-gray-500 text-lg">Proceed to Aisle A, Bin 12 and confirm location arrival.</p>
                    </motion.div>
                )}

                {scanStep === 1 && (
                    <motion.div 
                        key="scan"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-4 text-gray-400">
                            <Boxes className="w-6 h-6" />
                            <span className="text-sm uppercase font-black tracking-widest italic">Verification Required</span>
                        </div>
                        <div className="p-8 border-2 border-dashed border-white/20 bg-white/5 text-center rounded-3xl">
                            <h3 className="text-2xl font-bold mb-2 uppercase">{currentItem.name}</h3>
                            <p className="font-mono text-blue-400">SKU: {currentItem.sku}</p>
                            <div className="mt-6 text-4xl font-black">X {currentItem.quantity}</div>
                        </div>
                    </motion.div>
                )}

                 {scanStep === 2 && (
                    <motion.div 
                        key="done"
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <div className="w-24 h-24 bg-green-500 text-black flex items-center justify-center rounded-full shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                            <CheckCircle className="w-12 h-12" />
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">Verified</h2>
                        <p className="text-gray-400 max-w-xs">Item successfully picked and deducted from inventory. Transferring to Packing Station 4.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Big Action Button */}
        <button 
            onClick={handleNextStep}
            className={`w-full py-8 rounded-3xl font-black uppercase tracking-widest text-xl transition-all active:scale-95 shadow-2xl ${
                scanStep === 2 
                    ? 'bg-green-500 text-black shadow-green-500/20' 
                    : 'bg-white text-black shadow-white/10'
            }`}
        >
            {scanStep === 0 ? 'Confirm Arrival' : scanStep === 1 ? 'Scan SKU' : 'Complete Pick'}
        </button>
      </main>

      {/* Handheld Footer */}
      <footer className="p-6 bg-white/5 border-t border-white/10 flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <History className="w-3 h-3" /> Last sync: 2s ago
            </div>
      </footer>
    </div>
  );
}
