// Centralized mock data for the Admin dashboard (users, orders, settings)
/** biome-ignore-all lint/style/noMagicNumbers: MOCK DATA */

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'customer';
  status: 'active' | 'suspended' | 'pending';
  lastActiveAt: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

export type AdminOrder = {
  id: string;
  customerName: string;
  email: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  createdAt: string;
};

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'u_1001',
    name: 'Ava Thompson',
    email: 'ava.thompson@example.com',
    role: 'admin',
    status: 'active',
    lastActiveAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u_1002',
    name: 'Noah Patel',
    email: 'noah.patel@example.com',
    role: 'manager',
    status: 'active',
    lastActiveAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u_1003',
    name: 'Mia Chen',
    email: 'mia.chen@example.com',
    role: 'customer',
    status: 'pending',
    lastActiveAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u_1004',
    name: 'Liam Johnson',
    email: 'liam.johnson@example.com',
    role: 'customer',
    status: 'suspended',
    lastActiveAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockAdminOrders: AdminOrder[] = [
  {
    id: 'ord_2001',
    customerName: 'Ethan Brown',
    email: 'ethan.brown@example.com',
    status: 'pending',
    items: [
      {
        productId: '1',
        name: 'Crimson Scallop Plate',
        quantity: 2,
        price: 89.99,
      },
    ],
    total: 179.98,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord_2002',
    customerName: 'Sophia Wilson',
    email: 'sophia.wilson@example.com',
    status: 'processing',
    items: [
      {
        productId: '2',
        name: 'Golden Sear Collection',
        quantity: 1,
        price: 149.99,
      },
      {
        productId: '3',
        name: 'White Plate Collection',
        quantity: 1,
        price: 64.99,
      },
    ],
    total: 214.98,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord_2003',
    customerName: 'Olivia Davis',
    email: 'olivia.davis@example.com',
    status: 'shipped',
    items: [
      { productId: '4', name: 'Black Plate Series', quantity: 3, price: 79.99 },
    ],
    total: 239.97,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord_2004',
    customerName: 'James Anderson',
    email: 'james.anderson@example.com',
    status: 'delivered',
    items: [
      {
        productId: '1',
        name: 'Crimson Scallop Plate',
        quantity: 1,
        price: 89.99,
      },
      {
        productId: '3',
        name: 'White Plate Collection',
        quantity: 2,
        price: 64.99,
      },
    ],
    total: 219.97,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockFooterLinks = [
  { id: 'f_1', label: 'Twitter', url: 'https://twitter.com/oryx' },
  { id: 'f_2', label: 'Instagram', url: 'https://instagram.com/oryx' },
  { id: 'f_3', label: 'YouTube', url: 'https://youtube.com/@oryx' },
  { id: 'f_4', label: 'LinkedIn', url: 'https://linkedin.com/company/oryx' },
];

export const mockSearchRecommendations = [
  'scallop plate',
  'golden sear dinnerware',
  'white plate',
  'black matte plate',
  'chinaware sets',
];
