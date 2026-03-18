import { useState } from 'react';
import { Search, AlertTriangle, MapPin, Package } from 'lucide-react';
import { useStore } from '@/store';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';


const categories = ['All', 'Electronics', 'Apparel', 'Home', 'Footwear', 'Office', 'Fitness', 'Accessories'];

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const { items, addLog, addInventorySku, currentWarehouseId } = useStore();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ sku: '', name: '', category: 'Electronics', stock: 0, minStock: 5, aisle: 'A', bin: '01' });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.sku || !newItem.name) return;
    
    addInventorySku({
      ...newItem,
      warehouseId: currentWarehouseId, // Assign to current node
      location: { aisle: newItem.aisle, bin: newItem.bin },
      lastUpdated: new Date()
    });
    addLog('inventory', `New SKU ${newItem.sku} specified for ${currentWarehouseId}`);
    setIsAddingItem(false);
    setNewItem({ sku: '', name: '', category: 'Electronics', stock: 0, minStock: 5, aisle: 'A', bin: '01' });
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesLowStock = !showLowStockOnly || item.stock <= item.minStock;
    return matchesSearch && matchesCategory && matchesLowStock;
  });



  const lowStockCount = items.filter(i => i.stock <= i.minStock).length;

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
                        Stock <br/><span className="text-gray-400 uppercase">Integrity</span>
                    </h2>
                    <p className="max-w-xl text-sm font-medium leading-relaxed italic text-gray-500">
                        "This page ensures you never sell an item you don't have. The Engine automatically deducts stock as orders are processed. High-accuracy inventory prevents customer disappointment and human counting errors."
                    </p>
                </div>
                
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => setIsAddingItem(!isAddingItem)}
                        className="px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest border-2 border-black hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                    >
                        {isAddingItem ? 'Cancel Specification' : 'Add New Engine SKU'}
                    </button>
                    {lowStockCount > 0 && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white border-2 border-black font-black uppercase tracking-tighter text-[10px]">
                            <AlertTriangle className="w-4 h-4" />
                            <span>{lowStockCount} Stock Anomalies Detected</span>
                        </div>
                    )}
                </div>
            </div>

            {isAddingItem && (
                <div className="mb-6 p-6 border border-black bg-gray-50">
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-600">Enter SKU Specifications</h2>
                    <form onSubmit={handleAddItem} className="grid grid-cols-4 gap-4">
                        <input 
                            placeholder="SKU ID (e.g. ELEC-005)" 
                            required
                            className="p-2 border border-black text-sm" 
                            value={newItem.sku}
                            onChange={e => setNewItem({...newItem, sku: e.target.value})}
                        />
                        <input 
                            placeholder="Product Name" 
                            required
                            className="p-2 border border-black text-sm col-span-2" 
                            value={newItem.name}
                            onChange={e => setNewItem({...newItem, name: e.target.value})}
                        />
                        <select 
                            className="p-2 border border-black text-sm"
                            value={newItem.category}
                            onChange={e => setNewItem({...newItem, category: e.target.value})}
                        >
                            {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input 
                            type="number" 
                            placeholder="Initial Stock" 
                            className="p-2 border border-black text-sm" 
                            value={newItem.stock}
                            onChange={e => setNewItem({...newItem, stock: parseInt(e.target.value) || 0})}
                        />
                        <input 
                            type="number" 
                            placeholder="Min Threshold" 
                            className="p-2 border border-black text-sm" 
                            value={newItem.minStock}
                            onChange={e => setNewItem({...newItem, minStock: parseInt(e.target.value) || 0})}
                        />
                        <input 
                            placeholder="Aisle" 
                            className="p-2 border border-black text-sm font-mono" 
                            value={newItem.aisle}
                            onChange={e => setNewItem({...newItem, aisle: e.target.value})}
                        />
                        <button type="submit" className="bg-black text-white p-2 text-sm font-bold">COMMIT SKU</button>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search SKUs or products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-black text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-black text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLowStockOnly}
                  onChange={(e) => setShowLowStockOnly(e.target.checked)}
                  className="w-4 h-4 border-black"
                />
                <span>Low stock only</span>
              </label>
            </div>

            {/* Inventory Table (NORMAL BORDER) */}
            <div className="border border-black overflow-hidden bg-white">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-black bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <div className="col-span-1">Node</div>
                <div className="col-span-2">SKU ID</div>
                <div className="col-span-3">Product Specification</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Stock / Runway</div>
                <div className="col-span-2">Location</div>
              </div>
              <div className="divide-y divide-black bg-white">
                {filteredItems.length === 0 ? (
                  <div className="px-4 py-12 text-center text-gray-500 text-sm">
                    No items found matching your criteria.
                  </div>
                ) : (
                  filteredItems.map((item) => {
                    const isLowStock = item.stock <= item.minStock;
                    return (
                      <div
                        key={item.sku}
                        className={`grid grid-cols-12 gap-4 px-4 py-4 items-center ${isLowStock ? 'bg-red-50/30' : ''}`}
                      >
                        <div className="col-span-1">
                            <span className="text-[10px] font-black bg-black text-white px-1.5 py-0.5 rounded">{item.warehouseId}</span>
                        </div>
                        <div className="col-span-2 font-mono text-sm font-bold tracking-tighter">{item.sku}</div>
                        <div className="col-span-3">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-black uppercase tracking-tighter">{item.name}</span>
                          </div>
                        </div>
                        <div className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.category}</div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <span className={`font-mono text-lg ${isLowStock ? 'text-red-600 font-black underline decoration-2' : 'font-black'}`}>
                              {item.stock}
                            </span>
                            {isLowStock && <AlertTriangle className="w-3 h-3 text-red-600" />}
                          </div>
                          <div className="text-[10px] font-black uppercase text-gray-400 mt-1">
                            Runway: <span className={item.runwayDays && item.runwayDays < 5 ? 'text-red-500' : ''}>{item.runwayDays || '?'} Days</span>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="font-mono font-bold tracking-widest text-xs bg-gray-100 px-2 py-1 border border-black/5">{item.location.aisle}-{item.location.bin}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )
              }
              </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="border border-black p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Units</div>
                <div className="text-2xl font-bold font-mono">
                  {items.reduce((sum, item) => sum + item.stock, 0).toLocaleString()}
                </div>
              </div>
              <div className="border border-black p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Categories</div>
                <div className="text-2xl font-bold font-mono">
                  {new Set(items.map(i => i.category)).size}
                </div>
              </div>
              <div className="border border-black p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Low Stock</div>
                <div className="text-2xl font-bold font-mono">{lowStockCount}</div>
              </div>
              <div className="border border-black p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Avg Stock/SKU</div>
                <div className="text-2xl font-bold font-mono">
                  {Math.round(items.reduce((sum, item) => sum + item.stock, 0) / items.length || 0)}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
