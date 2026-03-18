import { createContext, useContext, useEffect, useRef } from 'react';
import { useStore } from '@/store';
import { generateOrder } from '@/lib/mockData';

interface EngineContextType {
  startEngine: () => void;
  stopEngine: () => void;
}

const EngineContext = createContext<EngineContextType | null>(null);

const STEP_DURATIONS_SEC = {
  pending: 0,
  picking: 30, // 30 "simulated" seconds
  packing: 20,
  shipped: 0,
  exception: 0
};

export function EngineProvider({ children }: { children: React.ReactNode }) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const processWorkflow = () => {
    const state = useStore.getState();
    const { engineConfig, currentWarehouseId } = state;
    const now = new Date();
    
    // 1. Ingestion Engine (Filtered to Active Warehouse)
    const integrationBoost = engineConfig.activeIntegrations.length * 0.1;
    if (Math.random() < (engineConfig.orderRate + integrationBoost)) {
      const newOrder = generateOrder('pending');
      newOrder.warehouseId = currentWarehouseId; 
      state.addOrder(newOrder);
      state.addLog('order', `Order ${newOrder.id} ingested @ ${currentWarehouseId}`, `Autonomous routing initiated`);
    }

    // 2. Assignment Engine
    const pendingOrders = state.orders.filter(o => o.status === 'pending' && !o.assignedTo && o.warehouseId === currentWarehouseId)
      .sort((a, b) => (b.isVIP ? 1 : 0) - (a.isVIP ? 1 : 0));
    
    const availablePickers = state.staff.filter(s => s.role === 'picker' && s.status === 'idle' && s.warehouseId === currentWarehouseId);
    
    pendingOrders.slice(0, availablePickers.length).forEach((order, index) => {
      const picker = availablePickers[index];
      if (picker) {
        state.assignOrder(order.id, picker.id);
        state.updateStaffStatus(picker.id, 'active');
        state.updateOrderStatus(order.id, 'picking');
        
        const distinctAisles = new Set(order.items.map(i => {
            const inv = state.items.find(item => item.sku === i.sku);
            return inv?.location.aisle;
        }));
        const batchEfficiency = distinctAisles.size === 1 ? 0.8 : 1.0;

        useStore.setState((s) => ({
            orders: s.orders.map(o => o.id === order.id ? {
                ...o,
                assignedAt: now,
                stepStartTime: now,
                estDurationMinutes: (0.5 * batchEfficiency)
            } : o)
        }));

        state.addLog('staff', `Engine Batching: ${picker.name} assigned to ${order.id}. ${batchEfficiency < 1 ? 'Route Optimized' : 'Standard Pick'}`);
      }
    });

    // 3. Picking Engine
    const pickingOrders = state.orders.filter(o => o.status === 'picking' && o.assignedTo && o.warehouseId === currentWarehouseId);
    pickingOrders.forEach(order => {
      if (engineConfig.exceptionsEnabled && Math.random() > 0.995) {
        const picker = state.staff.find(s => s.id === order.assignedTo);
        if (picker) {
          state.completeTask(picker.id);
          state.updateOrderStatus(order.id, 'exception');
          state.addLog('system', `Anomaly @ ${order.id}: Stock Discrepancy`, `Engine paused automated flow`);
        }
        return;
      }
      
      const timeElapsed = (now.getTime() - new Date(order.stepStartTime!).getTime()) / 1000;
      const adjustedDuration = (STEP_DURATIONS_SEC.picking * (order.estDurationMinutes! / 0.5)) / engineConfig.speedMultiplier;

      if (timeElapsed >= adjustedDuration) {
        const picker = state.staff.find(s => s.id === order.assignedTo);
        if (picker) {
          const staffCost = (adjustedDuration / 3600) * picker.hourlyRate;
          
          state.completeTask(picker.id);
          state.updateOrderStatus(order.id, 'packing');
          
          useStore.setState((s) => ({
              orders: s.orders.map(o => o.id === order.id ? {
                  ...o,
                  assignedTo: undefined,
                  stepStartTime: now,
                  estDurationMinutes: 0.33,
                  laborCost: (o.laborCost || 0) + staffCost
              } : o)
          }));
          
          state.addLog('order', `Engine: Picking complete for ${order.id}. Labor Incurred: $${staffCost.toFixed(2)}`);
          
          order.items.forEach(item => {
            state.updateStock(item.sku, -item.quantity);
          });
        }
      }
    });

    // 4. Packing Engine
    const packingOrders = state.orders.filter(o => o.status === 'packing' && !o.assignedTo && o.warehouseId === currentWarehouseId)
      .sort((a, b) => (b.isVIP ? 1 : 0) - (a.isVIP ? 1 : 0));
    
    const availablePackers = state.staff.filter(s => s.role === 'packer' && s.status === 'idle' && s.warehouseId === currentWarehouseId);
    
    packingOrders.slice(0, availablePackers.length).forEach((order, index) => {
      const packer = availablePackers[index];
      if (packer) {
        state.assignOrder(order.id, packer.id);
        state.updateStaffStatus(packer.id, 'active');
        
        useStore.setState((s) => ({
            orders: s.orders.map(o => o.id === order.id ? {
                ...o,
                stepStartTime: now
            } : o)
        }));
      }
    });

    // 5. Shipping Engine
    const activePackingOrders = state.orders.filter(o => o.status === 'packing' && o.assignedTo && o.warehouseId === currentWarehouseId);
    activePackingOrders.forEach(order => {
      const timeElapsed = (now.getTime() - new Date(order.stepStartTime!).getTime()) / 1000;
      const adjustedDuration = STEP_DURATIONS_SEC.packing / engineConfig.speedMultiplier;

      if (timeElapsed >= adjustedDuration) {
        const packer = state.staff.find(s => s.id === order.assignedTo);
        if (packer) {
          const staffCost = (adjustedDuration / 3600) * packer.hourlyRate;
          
          state.completeTask(packer.id);
          state.updateOrderStatus(order.id, 'shipped');
          
          useStore.setState((s) => ({
              orders: s.orders.map(o => o.id === order.id ? {
                  ...o,
                  laborCost: (o.laborCost || 0) + staffCost
              } : o)
          }));
          
          state.addLog('integration', `Engine marked order ${order.id} as SHIPPED. Total Labor: $${(order.laborCost || 0 + staffCost).toFixed(2)}`);
        }
      }
    });

    // 6. Predictive Inventory Runway Update
    if (Math.random() > 0.95) {
        useStore.setState((s) => ({
            items: s.items.map(item => ({
                ...item,
                runwayDays: Math.max(1, Math.floor(item.stock / (engineConfig.orderRate * 5 + 1)))
            }))
        }));
    }
  };

  const currentSpeedRef = useRef(1000); // 1s Engine Tick

  useEffect(() => {
    const state = useStore.getState();
    if (state.isEngineActive) {
      intervalRef.current = setInterval(processWorkflow, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = useStore.subscribe((state) => {
      if (state.isEngineActive && !intervalRef.current) {
        intervalRef.current = setInterval(processWorkflow, 1000);
      } else if (!state.isEngineActive && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    });
    return () => unsubscribe();
  }, []);

  const startEngine = () => {
    useStore.setState({ isEngineActive: true });
    useStore.getState().addLog('system', 'Fulfillment Engine Activated', 'Automated routing online');
  };

  const stopEngine = () => {
    useStore.setState({ isEngineActive: false });
    useStore.getState().addLog('system', 'Fulfillment Engine Shutdown', 'Manual mode active');
  };

  return (
    <EngineContext.Provider value={{ startEngine, stopEngine }}>
      {children}
    </EngineContext.Provider>
  );
}

export function useEngine() {
  const context = useContext(EngineContext);
  if (!context) {
    throw new Error('useEngine must be used within EngineProvider');
  }
  return context;
}
