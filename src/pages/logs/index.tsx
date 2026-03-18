import { useStore } from '@/store';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { useNavigate } from 'react-router-dom';

const logTypeConfig: Record<string, { label: string; bgColor: string; textColor: string }> = {
  order: { label: 'ORDER', bgColor: 'bg-black', textColor: 'text-white' },
  inventory: { label: 'INV', bgColor: 'bg-gray-500', textColor: 'text-white' },
  staff: { label: 'STAFF', bgColor: 'bg-gray-400', textColor: 'text-white' },
  system: { label: 'SYS', bgColor: 'bg-gray-200', textColor: 'text-black' },
  integration: { label: 'INT', bgColor: 'bg-blue-600', textColor: 'text-white' },
  anomaly: { label: 'ERR', bgColor: 'bg-red-600', textColor: 'text-white' },
};

export default function LogsPage() {
  const navigate = useNavigate();
  const { logs } = useStore();

  const getLogConfig = (type: string) => logTypeConfig[type] || { label: 'LOG', bgColor: 'bg-gray-100', textColor: 'text-gray-600' };

  const groupedLogs = logs.reduce((groups, log) => {
    const date = new Date(log.timestamp).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(log);
    return groups;
  }, {} as Record<string, typeof logs>);

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {/* Page Header (Intro Component - BOLD) */}
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-start justify-between mb-8">
                <div className="space-y-4">
                    <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
                        Activity <br/><span className="text-gray-400 uppercase">Audit Trail</span>
                    </h2>
                    <p className="max-w-xl text-sm font-medium leading-relaxed italic text-gray-500">
                      "This trail provides a real-time audit of every decision the Engine makes. It maps the movement of inventory, the coordination of staff, and the automated resolution of fulfillment conflicts."
                    </p>
                </div>
                
                <div className="border border-black p-4 min-w-[200px] bg-gray-50 flex flex-col items-center justify-center text-center">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Entries</div>
                    <div className="text-3xl font-black font-mono">{logs.length}</div>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-widest text-gray-400">System Records</p>
                </div>
            </div>

            {/* Logs Feed (The Rest - NORMAL BORDER) */}
            <div className="border border-black bg-white">
              <div className="px-4 py-3 border-b border-black bg-gray-50 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live Event Feed
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Node Cluster Active</span>
              </div>
              
              <div className="divide-y divide-gray-200 max-h-[calc(100vh-420px)] overflow-auto custom-scrollbar bg-white">
                {logs.length === 0 ? (
                  <div className="px-4 py-12 text-center text-gray-500 text-xs uppercase font-black italic">
                    Engine IDLE. Awaiting events...
                  </div>
                ) : (
                  Object.entries(groupedLogs).map(([date, dayLogs]) => (
                    <div key={date}>
                      <div className="px-4 py-2 bg-gray-50 border-y border-gray-200 sticky top-0 z-10">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{date}</span>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {dayLogs.map((log) => {
                          const config = getLogConfig(log.type);
                          return (
                            <div 
                              key={log.id} 
                              onClick={() => navigate(`/logs/${log.id}`)}
                              className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                            >
                              <div className="flex items-start gap-6">
                                <span className={`w-16 h-6 flex items-center justify-center text-[9px] font-black uppercase tracking-widest ${config.bgColor} ${config.textColor}`}>
                                  {config.label}
                                </span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <span className="font-mono text-[10px] font-bold text-gray-400">
                                      {new Date(log.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  <p className="text-sm font-medium">{log.message}</p>
                                  {log.details && (
                                    <p className="text-xs text-gray-400 mt-1 italic leading-relaxed">{log.details}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center gap-6 text-xs">
              <span className="text-gray-500">Event Types:</span>
              {Object.entries(logTypeConfig).map(([type, config]) => (
                <div key={type} className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 ${config.bgColor} ${config.textColor}`}>
                    {config.label}
                  </span>
                  <span className="text-gray-500 capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
