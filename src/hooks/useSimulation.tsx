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
    const { engineConfig } = state;
    const now = new Date();
    
    // 1. Ingestion Engine
    const integrationBoost = engineConfig.activeIntegrations.length * 0.1;
    if (Math.random() < (engineConfig.orderRate + integrationBoost)) {
      const newOrder = generateOrder('pending');
      state.addOrder(newOrder);
      state.addLog('order', `New order ${newOrder.id} ingested by Engine`, `Autonomous routing initiated`);
    }

    // 2. Assignment Engine (Prevention of Human Mistake)
    const pendingOrders = state.orders.filter(o => o.status === 'pending' && !o.assignedTo)
      .sort((a, b) => (b.isVIP ? 1 : 0) - (a.isVIP ? 1 : 0));
    
    const availablePickers = state.staff.filter(s => s.role === 'picker' && s.status === 'idle');
    
    pendingOrders.slice(0, availablePickers.length).forEach((order, index) => {
      const picker = availablePickers[index];
      if (picker) {
        state.assignOrder(order.id, picker.id);
        state.updateStaffStatus(picker.id, 'active');
        state.updateOrderStatus(order.id, 'picking');
        
        // Set Durations
        useStore.setState((s) => ({
            orders: s.orders.map(o => o.id === order.id ? {
                ...o,
                assignedAt: now,
                stepStartTime: now,
                estDurationMinutes: 0.5 // 30 seconds
            } : o)
        }));

        state.addLog('staff', `Engine autonomously assigned ${picker.name} to order ${order.id}`);
      }
    });

    // 3. Picking Engine
    const pickingOrders = state.orders.filter(o => o.status === 'picking' && o.assignedTo);
    pickingOrders.forEach(order => {
      // Check for human mistakes / anomalies
      if (engineConfig.exceptionsEnabled && Math.random() > 0.99) {
        const picker = state.staff.find(s => s.id === order.assignedTo);
        if (picker) {
          state.completeTask(picker.id);
          state.updateOrderStatus(order.id, 'exception');
          state.addLog('system', `Engine detected anomaly on order ${order.id}`, `Manual review required`);
        }
        return;
      }
      
      // Automatic state transition based on estimated time
      const timeElapsed = (now.getTime() - new Date(order.stepStartTime!).getTime()) / 1000;
      const adjustedDuration = STEP_DURATIONS_SEC.picking / engineConfig.speedMultiplier;

      if (timeElapsed >= adjustedDuration) {
        const picker = state.staff.find(s => s.id === order.assignedTo);
        if (picker) {
          state.completeTask(picker.id);
          state.updateOrderStatus(order.id, 'packing');
          
          useStore.setState((s) => ({
              orders: s.orders.map(o => o.id === order.id ? {
                  ...o,
                  assignedTo: undefined,
                  stepStartTime: now,
                  estDurationMinutes: 0.33 // 20 seconds
              } : o)
          }));
          
          state.addLog('order', `Engine: Picking completed for ${order.id}. Moving to Packing.`);
          
          order.items.forEach(item => {
            state.updateStock(item.sku, -item.quantity);
          });
        }
      }
    });

    // 4. Packing Engine
    const packingOrders = state.orders.filter(o => o.status === 'packing' && !o.assignedTo)
      .sort((a, b) => (b.isVIP ? 1 : 0) - (a.isVIP ? 1 : 0));
    
    const availablePackers = state.staff.filter(s => s.role === 'packer' && s.status === 'idle');
    
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
    const activePackingOrders = state.orders.filter(o => o.status === 'packing' && o.assignedTo);
    activePackingOrders.forEach(order => {
      const timeElapsed = (now.getTime() - new Date(order.stepStartTime!).getTime()) / 1000;
      const adjustedDuration = STEP_DURATIONS_SEC.packing / engineConfig.speedMultiplier;

      if (timeElapsed >= adjustedDuration) {
        const packer = state.staff.find(s => s.id === order.assignedTo);
        if (packer) {
          state.completeTask(packer.id);
          state.updateOrderStatus(order.id, 'shipped');
          state.addLog('order', `Engine autonomously marked order ${order.id} as shipped`);
        }
      }
    });
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
