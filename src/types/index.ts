export type OrderStatus = 'pending' | 'picking' | 'packing' | 'shipped' | 'exception';

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: Date;
  isVIP?: boolean;
  assignedTo?: string;
  assignedAt?: Date;
  stepStartTime?: Date;
  estDurationMinutes?: number;
  stepDuration?: number;
  currentStepStarted?: Date;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  laborCost?: number; // Labor cost incurred during fulfillment
  warehouseId: string; // Multi-warehouse mapping
}

export interface EngineConfig {
  speedMultiplier: number; // e.g., 1 for normal, 2 for 2x speed
  orderRate: number;       // Probability 0-1
  pickingRate: number;     // Probability 0-1
  packingRate: number;     // Probability 0-1
  exceptionsEnabled: boolean;
  activeIntegrations: string[]; // e.g., 'shopify', 'fedex'
}

export interface InventoryItem {
  sku: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  location: {
    aisle: string;
    bin: string;
  };
  lastUpdated: Date;
  warehouseId: string; // Multi-warehouse mapping
  runwayDays?: number; // Predictive inventory runway
}

export type StaffRole = 'picker' | 'packer' | 'supervisor';
export type StaffStatus = 'active' | 'idle' | 'offline';

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  status: StaffStatus;
  currentTask?: string;
  ordersCompleted: number;
  efficiency: number;
  hourlyRate: number; // For labor cost calculations
  warehouseId: string; // Multi-warehouse mapping
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'order' | 'inventory' | 'staff' | 'system' | 'integration';
  message: string;
  details?: string;
}

export interface DashboardKPI {
  label: string;
  value: string | number;
  change?: number;
  prefix?: string;
  suffix?: string;
}

export interface AnalyticsData {
  ordersOverTime: {
    date: string;
    orders: number;
  }[];
  fulfillmentSpeed: {
    stage: string;
    avgMinutes: number;
  }[];
  staffProductivity: {
    name: string;
    orders: number;
    efficiency: number;
  }[];
}
