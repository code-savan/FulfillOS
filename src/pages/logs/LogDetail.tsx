import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { ArrowLeft, Clock, Info, Shield, Server, Box } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

const logTypeConfig: Record<string, { label: string; bgColor: string; textColor: string; icon: any }> = {
  order: { label: 'ORDER', bgColor: 'bg-black', textColor: 'text-white', icon: Box },
  inventory: { label: 'INV', bgColor: 'bg-gray-500', textColor: 'text-white', icon: Server },
  staff: { label: 'STAFF', bgColor: 'bg-gray-400', textColor: 'text-white', icon: Shield },
  system: { label: 'SYS', bgColor: 'bg-gray-200', textColor: 'text-black', icon: Info },
  integration: { label: 'INT', bgColor: 'bg-blue-600', textColor: 'text-white', icon: Server },
  anomaly: { label: 'ERR', bgColor: 'bg-red-600', textColor: 'text-white', icon: Shield },
};

export default function LogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logs } = useStore();
  
  const log = logs.find(l => l.id === id);

  if (!log) {
    return (
      <div className="min-h-screen bg-white flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Log Not Found</h1>
            <p className="text-gray-500 mb-8">The requested event record no longer exists in history.</p>
            <button onClick={() => navigate('/logs')} className="px-6 py-2 border-2 border-black font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                Return to Audit Trail
            </button>
          </div>
        </div>
      </div>
    );
  }

  const config = logTypeConfig[log.type] || { label: 'LOG', bgColor: 'bg-gray-100', textColor: 'text-gray-600', icon: Info };
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar />
        
        <main className="flex-1 p-6 overflow-auto bg-gray-50 border-l border-black">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Nav Header */}
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/logs')}
                  className="w-12 h-12 flex items-center justify-center border-2 border-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none translate-x-[-2px]"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                   <h2 className="text-[10px] uppercase font-black tracking-widest text-gray-400 leading-none mb-1">Audit Record</h2>
                   <span className="font-mono text-xl font-black">{log.id}</span>
                </div>
            </div>

            {/* Log Detail Card (INTRO STYLE - BOLD) */}
            <div className="bg-white border-4 border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
                <div className="flex items-start justify-between">
                    <div className={`px-4 py-2 text-xs font-black uppercase tracking-widest ${config.bgColor} ${config.textColor}`}>
                        {config.label} EVENT
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 font-mono text-sm font-bold uppercase">
                        <Clock className="w-4 h-4" />
                        {new Date(log.timestamp).toLocaleString()}
                    </div>
                </div>

                <div className="space-y-4 border-l-8 border-black pl-8">
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-tight max-w-2xl">
                        {log.message}
                    </h1>
                </div>

                {log.details && (
                    <div className="p-8 bg-gray-50 border-2 border-black border-dashed">
                        <div className="text-[10px] uppercase font-black text-gray-400 mb-4 tracking-widest flex items-center gap-2">
                            <Info className="w-3 h-3" /> Extended Metadata
                        </div>
                        <p className="text-xl font-medium leading-relaxed italic text-gray-600">
                           "{log.details}"
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-black">
                    <div>
                        <div className="text-[10px] font-black uppercase text-gray-400 mb-2">Internal Origin</div>
                        <div className="flex items-center gap-2 font-bold px-2 py-1 bg-gray-100 border border-black/5 text-xs w-fit">
                            <Icon className="w-4 h-4" />
                            {log.type.toUpperCase()} CORE
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase text-gray-400 mb-2">Persistence</div>
                        <div className="font-mono text-xs font-black">LOCAL_VOLATILE_STORE</div>
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase text-gray-400 mb-2">Relativity</div>
                        <div className="font-mono text-xs font-black">REALTIME_EXEC_TRACE</div>
                    </div>
                </div>
            </div>

            {/* Secondary Action */}
            <div className="flex justify-end">
                <button 
                  onClick={() => navigate('/logs')}
                  className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-400 hover:text-black hover:border-black transition-all"
                >
                    Return to Full Trail
                </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
