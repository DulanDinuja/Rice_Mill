import { localStorageService } from './localStorageService';

const STORAGE_KEYS = {
  THRESHING_RECORDS: 'threshing_records',
  PADDY_SALES: 'paddy_sales',
  PADDY_ADD_STOCK: 'paddy_add_stock',
  RICE_SALES: 'rice_sales',
  RICE_ADD_STOCK: 'rice_add_stock'
};

export const REPORT_TYPES = {
  PADDY_THRESHING: 'paddy_threshing',
  PADDY_SALE: 'paddy_sale',
  PADDY_ADD_STOCK: 'paddy_add_stock',
  RICE_SALE: 'rice_sale',
  RICE_ADD_STOCK: 'rice_add_stock'
};

// Helper function to check if date is within range
const isDateInRange = (dateStr, fromDate, toDate) => {
  const date = new Date(dateStr);
  const from = fromDate ? new Date(fromDate) : new Date('2000-01-01');
  const to = toDate ? new Date(toDate) : new Date('2100-12-31');

  // Set time to start/end of day for accurate comparison
  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);
  date.setHours(0, 0, 0, 0);

  return date >= from && date <= to;
};

// Helper function to filter by optional criteria
const matchesFilters = (item, filters) => {
  if (filters.warehouse && item.warehouse !== filters.warehouse) return false;
  if (filters.paddyType && item.paddyType !== filters.paddyType) return false;
  if (filters.riceType && item.riceType !== filters.riceType) return false;
  return !(filters.supplier && item.supplier !== filters.supplier);
};

// Generate mock threshing records if not exist
const getThreshingRecords = () => {
  let records = localStorageService.getItem(STORAGE_KEYS.THRESHING_RECORDS);
  if (!records || records.length === 0) {
    records = [
      {
        id: 1,
        paddyType: 'Nadu',
        quantity: 1000,
        moistureLevel: 14,
        warehouse: 'Main Warehouse',
        supplier: 'Farmer Co-op A',
        date: '2025-01-15T08:00:00Z',
        actionType: 'Threshing'
      },
      {
        id: 2,
        paddyType: 'Keeri Samba',
        quantity: 750,
        moistureLevel: 12,
        warehouse: 'Warehouse B',
        supplier: 'Farmer Co-op B',
        date: '2025-01-20T10:30:00Z',
        actionType: 'Threshing'
      },
      {
        id: 3,
        paddyType: 'Samba',
        quantity: 1200,
        moistureLevel: 13,
        warehouse: 'Main Warehouse',
        supplier: 'Farmer Co-op C',
        date: '2025-02-01T09:00:00Z',
        actionType: 'Threshing'
      }
    ];
    localStorageService.setItem(STORAGE_KEYS.THRESHING_RECORDS, records);
  }
  return records;
};

// Generate mock paddy add stock records if not exist
const getPaddyAddStockRecords = () => {
  const stocks = localStorageService.getPaddyStocks();
  return stocks.map(stock => ({
    ...stock,
    date: stock.lastUpdated || stock.createdAt,
    actionType: 'Add Stock'
  }));
};

// Generate mock rice add stock records if not exist
const getRiceAddStockRecords = () => {
  const stocks = localStorageService.getRiceStocks();
  return stocks.map(stock => ({
    ...stock,
    date: stock.lastUpdated || stock.createdAt,
    actionType: 'Add Stock'
  }));
};

export const reportsService = {
  // Get reports based on filters
  getReports: async (fromDate, toDate, reportType, filters = {}) => {
    try {
      let data = [];

      switch (reportType) {
        case REPORT_TYPES.PADDY_THRESHING:
          data = getThreshingRecords();
          break;

        case REPORT_TYPES.PADDY_SALE:
          data = localStorageService.getPaddySales();
          data = data.map(sale => ({
            ...sale,
            date: sale.createdAt || sale.date,
            actionType: 'Sale'
          }));
          break;

        case REPORT_TYPES.PADDY_ADD_STOCK:
          data = getPaddyAddStockRecords();
          break;

        case REPORT_TYPES.RICE_SALE:
          data = localStorageService.getRiceSales();
          data = data.map(sale => ({
            ...sale,
            date: sale.createdAt || sale.date,
            actionType: 'Sale'
          }));
          break;

        case REPORT_TYPES.RICE_ADD_STOCK:
          data = getRiceAddStockRecords();
          break;

        default:
          throw new Error('Invalid report type');
      }

      // Filter by date range
      if (fromDate || toDate) {
        data = data.filter(item => isDateInRange(item.date, fromDate, toDate));
      }

      // Apply optional filters
      data = data.filter(item => matchesFilters(item, filters));

      // Sort by date (newest first)
      data.sort((a, b) => new Date(b.date) - new Date(a.date));

      return { data, success: true };
    } catch (error) {
      console.error('Error fetching reports:', error);
      return { data: [], success: false, error: error.message };
    }
  },

  // Get chart data for dashboard
  getChartData: async (fromDate, toDate, reportType) => {
    try {
      const result = await reportsService.getReports(fromDate, toDate, reportType);
      const data = result.data;

      // Group by month or day depending on date range
      const groupedData = {};

      data.forEach(item => {
        const date = new Date(item.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!groupedData[monthKey]) {
          groupedData[monthKey] = {
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            rice: 0,
            paddy: 0,
            quantity: 0
          };
        }

        const quantity = item.quantity || 0;
        groupedData[monthKey].quantity += quantity;

        if (reportType.includes('rice')) {
          groupedData[monthKey].rice += quantity;
        } else {
          groupedData[monthKey].paddy += quantity;
        }
      });

      return Object.values(groupedData);
    } catch (error) {
      console.error('Error generating chart data:', error);
      return [];
    }
  },

  // Get all warehouses
  getWarehouses: () => {
    const riceStocks = localStorageService.getRiceStocks();
    const paddyStocks = localStorageService.getPaddyStocks();

    const warehouses = new Set();
    [...riceStocks, ...paddyStocks].forEach(stock => {
      if (stock.warehouse) warehouses.add(stock.warehouse);
    });

    return Array.from(warehouses);
  },

  // Get all suppliers
  getSuppliers: () => {
    const paddyStocks = localStorageService.getPaddyStocks();
    const threshingRecords = getThreshingRecords();

    const suppliers = new Set();
    [...paddyStocks, ...threshingRecords].forEach(item => {
      if (item.supplier) suppliers.add(item.supplier);
    });

    return Array.from(suppliers);
  }
};
