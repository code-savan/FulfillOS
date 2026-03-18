import { useStore } from '@/store';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';


const logTypeConfig: Record<string, { label: string; bgColor: string; textColor: string }> = {
  order: { label: 'ORDER', bgColor: 'bg-black', textColor: 'text-white' },
  inventory: { label: 'INV', bgColor: 'bg-gray-500', textColor: 'text-white' },
  staff: { label: 'STAFF', bgColor: 'bg-gray-400', textColor: 'text-white' },
  system: { label: 'SYS', bgColor: 'bg-gray-200', textColor: 'text-black' }
};

export default function LogsPage() {
  const { logs } = useStore();

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
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Activity Logs</h1>
                <p className="text-sm text-gray-500 mt-1">Real-time system activity feed</p>
              </div>
              <div className="text-sm text-gray-500">
                Total Entries: <span className="font-mono font-medium">{logs.length}</span>
              </div>
            </div>

            {/* Logs Feed */}
            <div className="border border-black">
              <div className="px-4 py-3 border-b border-black bg-gray-50 flex items-center justify-between">
                <span className="text-sm font-medium">System Events</span>
                <span className="text-xs text-gray-500">Auto-refresh enabled</span>
              </div>
              
              <div className="divide-y divide-gray-200 max-h-[calc(100vh-280px)] overflow-auto">
                {logs.length === 0 ? (
                  <div className="px-4 py-12 text-center text-gray-500 text-sm">
                    No activity logs yet. Start simulation to generate events.
                  </div>
                ) : (
                  Object.entries(groupedLogs).map(([date, dayLogs]) => (
                    <div key={date}>
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 sticky top-0">
                        <span className="text-xs font-medium text-gray-500">{date}</span>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {dayLogs.map((log) => {
                          const typeConfig = logTypeConfig[log.type];
                          return (
                            <div key={log.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-start gap-4">
                                <span className={`px-2 py-1 text-xs font-medium ${typeConfig.bgColor} ${typeConfig.textColor}`}>
                                  {typeConfig.label}
                                </span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <span className="font-mono text-xs text-gray-400">
                                      {new Date(log.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  <p className="text-sm">{log.message}</p>
                                  {log.details && (
                                    <p className="text-xs text-gray-500 mt-1">{log.details}</p>
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
