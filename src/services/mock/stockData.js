export const mockRiceStocks = [
  {
    id: 1,
    riceType: 'Basmati',
    quantity: 1500,
    unit: 'kg',
    warehouse: 'Main Warehouse',
    grade: 'A+',
    pricePerKg: 120,
    lastUpdated: '2024-01-15T10:30:00Z',
    status: 'In Stock',
    qrCode: 'BASMATI001'
  },
  {
    id: 2,
    riceType: 'Sona Masoori',
    quantity: 800,
    unit: 'kg',
    warehouse: 'Warehouse B',
    grade: 'A',
    pricePerKg: 85,
    lastUpdated: '2024-01-14T14:20:00Z',
    status: 'In Stock',
    qrCode: 'SONA002'
  },
  {
    id: 3,
    riceType: 'Jasmine',
    quantity: 200,
    unit: 'kg',
    warehouse: 'Main Warehouse',
    grade: 'A+',
    pricePerKg: 150,
    lastUpdated: '2024-01-13T09:15:00Z',
    status: 'Low Stock',
    qrCode: 'JASMINE003'
  }
];

export const mockPaddyStocks = [
  {
    id: 1,
    paddyType: 'Raw Paddy',
    quantity: 5000,
    unit: 'kg',
    warehouse: 'Main Warehouse',
    moistureLevel: 14,
    pricePerKg: 25,
    supplier: 'Farmer Co-op A',
    lastUpdated: '2024-01-15T08:00:00Z',
    status: 'In Stock'
  },
  {
    id: 2,
    paddyType: 'Boiled Paddy',
    quantity: 3500,
    unit: 'kg',
    warehouse: 'Warehouse B',
    moistureLevel: 12,
    pricePerKg: 28,
    supplier: 'Farmer Co-op B',
    lastUpdated: '2024-01-14T11:30:00Z',
    status: 'In Stock'
  }
];

export const mockWarehouses = [
  {
    id: 1,
    name: 'Main Warehouse',
    location: 'Mumbai',
    capacity: 10000,
    currentStock: 7500,
    temperature: 25,
    humidity: 60
  },
  {
    id: 2,
    name: 'Warehouse B',
    location: 'Delhi',
    capacity: 8000,
    currentStock: 4300,
    temperature: 23,
    humidity: 55
  }
];
