import type { Order, InventoryItem, Staff, OrderStatus, OrderItem } from '@/types';

const FIRST_NAMES = ['James', 'Maria', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Patricia', 'David', 'Elizabeth', 'John', 'Susan', 'Richard', 'Jessica', 'Thomas', 'Sarah'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];

const PRODUCT_NAMES = [
  { name: 'Wireless Earbuds Pro', category: 'Electronics' },
  { name: 'Organic Cotton T-Shirt', category: 'Apparel' },
  { name: 'Stainless Water Bottle', category: 'Home' },
  { name: 'Running Shoes Elite', category: 'Footwear' },
  { name: 'Laptop Stand Adjustable', category: 'Office' },
  { name: 'Yoga Mat Premium', category: 'Fitness' },
  { name: 'Bluetooth Speaker Mini', category: 'Electronics' },
  { name: 'Canvas Backpack', category: 'Accessories' },
  { name: 'Smart Watch Series 5', category: 'Electronics' },
  { name: 'Ceramic Coffee Mug Set', category: 'Home' },
  { name: 'LED Desk Lamp', category: 'Office' },
  { name: 'Resistance Bands Set', category: 'Fitness' },
  { name: 'Leather Wallet', category: 'Accessories' },
  { name: 'Wireless Mouse', category: 'Electronics' },
  { name: 'Kitchen Knife Set', category: 'Home' }
];

const STREETS = ['Oak Street', 'Maple Avenue', 'Washington Blvd', 'Park Lane', 'Main Street', 'Cedar Road', 'Elm Drive', 'Pine Court', 'Lakeview Dr', 'Highland Ave'];
const CITIES = ['Los Angeles', 'San Francisco', 'New York', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin'];
const STATES = ['CA', 'NY', 'TX', 'IL', 'AZ', 'PA', 'FL', 'OH', 'WA', 'CO'];

export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

export function generateCustomerName(): string {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${first} ${last}`;
}

export function generateEmail(name: string): string {
  const cleanName = name.toLowerCase().replace(' ', '.');
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${cleanName}@${domain}`;
}

export function generateShippingAddress() {
  const streetNum = Math.floor(Math.random() * 9000) + 100;
  const street = STREETS[Math.floor(Math.random() * STREETS.length)];
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  const state = STATES[Math.floor(Math.random() * STATES.length)];
  const zip = Math.floor(Math.random() * 90000) + 10000;
  return {
    street: `${streetNum} ${street}`,
    city,
    state,
    zip: zip.toString()
  };
}

export function generateOrderItems(): OrderItem[] {
  const numItems = Math.floor(Math.random() * 3) + 1;
  const items: OrderItem[] = [];
  const usedProducts = new Set();

  for (let i = 0; i < numItems; i++) {
    let product;
    do {
      product = PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)];
    } while (usedProducts.has(product.name));
    
    usedProducts.add(product.name);
    items.push({
      sku: `SKU-${product.name.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900) + 100}`,
      name: product.name,
      quantity: Math.floor(Math.random() * 2) + 1,
      price: Math.floor(Math.random() * 150) + 20
    });
  }

  return items;
}

export function generateOrder(status: OrderStatus = 'pending'): Order {
  const customer = generateCustomerName();
  const items = generateOrderItems();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const warehouseId = Math.random() > 0.5 ? 'WH-01' : 'WH-02';

  return {
    id: generateId('ORD'),
    customer,
    email: generateEmail(customer),
    items,
    status,
    total,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000)),
    shippingAddress: generateShippingAddress(),
    warehouseId
  };
}

export function generateInventoryItems(): InventoryItem[] {
  const items: InventoryItem[] = [];
  const aisles = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  PRODUCT_NAMES.forEach((product, index) => {
    const aisle = aisles[Math.floor(index / 3)];
    const bin = String(Math.floor((index % 3) * 10) + Math.floor(Math.random() * 10)).padStart(2, '0');
    const warehouseId = index % 2 === 0 ? 'WH-01' : 'WH-02';
    
    items.push({
      sku: `SKU-${product.name.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900) + 100}`,
      name: product.name,
      category: product.category,
      stock: Math.floor(Math.random() * 200) + 10,
      minStock: 15,
      location: { aisle, bin },
      lastUpdated: new Date(),
      warehouseId,
      runwayDays: Math.floor(Math.random() * 30) + 5
    });
  });

  return items;
}

export function generateStaff(): Staff[] {
  const staff: Staff[] = [];

  for (let i = 0; i < 8; i++) {
    const role = i < 4 ? 'picker' : i < 7 ? 'packer' : 'supervisor';
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const warehouseId = i % 2 === 0 ? 'WH-01' : 'WH-02';
    const hourlyRate = role === 'picker' ? 18 : role === 'packer' ? 16 : 25;
    
    staff.push({
      id: generateId('STF'),
      name: `${first} ${last}`,
      role,
      status: Math.random() > 0.3 ? 'idle' : 'active',
      ordersCompleted: Math.floor(Math.random() * 150) + 20,
      efficiency: Math.floor(Math.random() * 30) + 70,
      hourlyRate,
      warehouseId
    });
  }

  return staff;
}

export function generateInitialOrders(count: number = 20): Order[] {
  const orders: Order[] = [];
  const statuses: OrderStatus[] = ['pending', 'picking', 'packing', 'shipped'];
  
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    orders.push(generateOrder(status));
  }

  return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
