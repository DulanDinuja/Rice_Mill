// For production: Use relative URL so it goes through the same domain (avoids mixed content)
// Configure your hosting to proxy /api requests to your backend server
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const STOCK_STATUS = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
  RESERVED: 'Reserved'
};

export const RICE_TYPES = [
  'White Raw',
  'Steam Nadu',
  'Steam Keeri',
  'Red Raw',
  'Keeri White Raw'
];

export const PADDY_TYPES = [
  'Nadu',
  'Keeri Samba',
  'Samba'
];

export const UNITS = ['kg', 'ton', 'quintal', 'bags'];

export const GRADES = ['A+', 'A', 'B+', 'B', 'C'];

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff'
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  RICE_STOCK: '/rice-stock',
  PADDY_STOCK: '/paddy-stock',
  REPORTS: '/reports',
  WAREHOUSE: '/warehouse',
  SETTINGS: '/settings',
  PROFILE: '/profile'
};
