import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, InventoryItem, Staff, LogEntry, OrderStatus, EngineConfig } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignOrder: (orderId: string, staffId: string) => void;
  markOrderVIP: (orderId: string) => void;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getRecentOrders: (count: number) => Order[];
}

interface InventoryState {
  items: InventoryItem[];
  updateStock: (sku: string, quantity: number) => void;
  addInventorySku: (item: InventoryItem) => void;
  getLowStock: () => InventoryItem[];
  getItemBySku: (sku: string) => InventoryItem | undefined;
}

interface StaffState {
  staff: Staff[];
  updateStaffStatus: (staffId: string, status: Staff['status']) => void;
  updateStaffRole: (staffId: string, role: Staff['role']) => void;
  assignTask: (staffId: string, task: string) => void;
  completeTask: (staffId: string) => void;
  getAvailableStaff: (role: Staff['role']) => Staff[];
}

interface LogState {
  logs: LogEntry[];
  addLog: (type: LogEntry['type'], message: string, details?: string) => void;
  getRecentLogs: (count: number) => LogEntry[];
}

interface EngineState {
  isEngineActive: boolean;
  setEngineActive: (active: boolean) => void;
  engineConfig: EngineConfig;
  updateEngineConfig: (config: Partial<EngineConfig>) => void;
  toggleIntegration: (id: string) => void;
}

interface AppState extends AuthState, OrderState, InventoryState, StaffState, LogState, EngineState {}

const DEMO_CREDENTIALS = {
  email: 'demo@fulfillos.com',
  password: 'password123'
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      isAuthenticated: false,
      user: null,
      login: (email: string, password: string) => {
        if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
          set({ 
            isAuthenticated: true, 
            user: { email: DEMO_CREDENTIALS.email, name: 'John ATL' } 
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },

      // Orders
      orders: [],
      addOrder: (order) => {
        set((state) => ({ orders: [order, ...state.orders] }));
      },
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          )
        }));
      },
      assignOrder: (orderId, staffId) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, assignedTo: staffId } : o
          )
        }));
      },
      markOrderVIP: (orderId) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, isVIP: true } : o
          )
        }));
      },
      getOrdersByStatus: (status) => {
        return get().orders.filter((o) => o.status === status);
      },
      getRecentOrders: (count) => {
        return get().orders.slice(0, count);
      },

      // Inventory
      items: [],
      updateStock: (sku, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.sku === sku
              ? { ...item, stock: Math.max(0, item.stock + quantity), lastUpdated: new Date() }
              : item
          )
        }));
      },
      addInventorySku: (item) => {
        set((state) => ({ items: [...state.items, item] }));
      },
      getLowStock: () => {
        return get().items.filter((item) => item.stock <= item.minStock);
      },
      getItemBySku: (sku) => {
        return get().items.find((item) => item.sku === sku);
      },

      // Staff
      staff: [],
      updateStaffStatus: (staffId, status) => {
        set((state) => ({
          staff: state.staff.map((s) =>
            s.id === staffId ? { ...s, status } : s
          )
        }));
      },
      updateStaffRole: (staffId, role) => {
        set((state) => ({
          staff: state.staff.map((s) =>
            s.id === staffId ? { ...s, role } : s
          )
        }));
      },
      assignTask: (staffId, task) => {
        set((state) => ({
          staff: state.staff.map((s) =>
            s.id === staffId ? { ...s, currentTask: task, status: 'active' } : s
          )
        }));
      },
      completeTask: (staffId) => {
        set((state) => ({
          staff: state.staff.map((s) =>
            s.id === staffId
              ? { ...s, currentTask: undefined, status: 'idle', ordersCompleted: s.ordersCompleted + 1 }
              : s
          )
        }));
      },
      getAvailableStaff: (role) => {
        return get().staff.filter((s) => s.role === role && s.status === 'idle');
      },

      // Logs
      logs: [],
      addLog: (type, message, details) => {
        const log: LogEntry = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          type,
          message,
          details
        };
        set((state) => ({ logs: [log, ...state.logs] }));
      },
      getRecentLogs: (count) => {
        return get().logs.slice(0, count);
      },

      // Engine
      isEngineActive: false,
      setEngineActive: (active: boolean) => {
        set({ isEngineActive: active });
      },
      engineConfig: {
        speedMultiplier: 1,
        orderRate: 0.7,
        pickingRate: 0.8,
        packingRate: 0.85,
        exceptionsEnabled: true,
        activeIntegrations: []
      },
      updateEngineConfig: (config) => {
        set((state) => ({ engineConfig: { ...state.engineConfig, ...config } }));
      },
      toggleIntegration: (id) => {
        set((state) => {
          const integrations = state.engineConfig.activeIntegrations;
          return {
            engineConfig: {
              ...state.engineConfig,
              activeIntegrations: integrations.includes(id)
                ? integrations.filter((i: string) => i !== id)
                : [...integrations, id]
            }
          };
        });
      }
    }),
    {
      name: 'fulfillos-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated, 
        user: state.user 
      })
    }
  )
);
