import axiosInstance from './api/axiosConfig';

const USE_MOCK = false;

export const REPORT_TYPES = {
  PADDY_THRESHING: 'PADDY_THRESHING',
  PADDY_SALE: 'PADDY_SALE',
  PADDY_STOCK: 'PADDY_STOCK',
  RICE_SALE: 'RICE_SALE',
  RICE_STOCK: 'RICE_STOCK'
};

export const reportsService = {
  // Get all system data for reports dashboard
  getAllSystemData: async () => {
    if (USE_MOCK) {
      return { data: {} };
    }
    return axiosInstance.get('/reports/all-system-data');
  },

  generateReport: async (reportRequest) => {
    if (USE_MOCK) {
      return { data: [] };
    }
    return axiosInstance.post('/reports/generate', reportRequest);
  },

  getReports: async (fromDate, toDate, reportType, filters = {}) => {
    const reportRequest = {
      fromDate: fromDate || null,
      toDate: toDate || null,
      reportType: reportType,
      warehouse: filters.warehouse || null,
      itemType: filters.paddyType || filters.riceType || null,
      customerOrSupplier: filters.supplier || null
    };
    const response = await reportsService.generateReport(reportRequest);
    return { data: response.data, success: true };
  },

  getChartData: async (fromDate, toDate, reportType) => {
    try {
      const result = await reportsService.getReports(fromDate, toDate, reportType);
      const data = result.data;
      const groupedData = {};
      const normalizedType = reportType?.toUpperCase() || '';
      const isPaddyThreshing = normalizedType.includes('PADDY_THRESHING');
      const isPaddySale = normalizedType.includes('PADDY_SALE');
      const isRiceSale = normalizedType.includes('RICE_SALE');
      const isRiceReport = normalizedType.includes('RICE');
      const isPaddyReport = normalizedType.includes('PADDY');

      data.forEach(item => {
        const date = new Date(item.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!groupedData[monthKey]) {
          groupedData[monthKey] = {
            month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            rice: 0,
            paddy: 0,
            quantity: 0,
            totalAmount: 0
          };
        }

        // Handle different quantity fields based on report type
        if (isPaddyThreshing) {
          // For threshing, we track both paddy input and rice output
          groupedData[monthKey].paddy += item.paddyQuantity || 0;
          groupedData[monthKey].rice += item.riceQuantity || 0;
          groupedData[monthKey].quantity += item.paddyQuantity || 0;
        } else if (isPaddySale) {
          // For paddy sales, track quantity and total amount
          const qty = item.quantity || item.paddyQuantity || 0;
          groupedData[monthKey].paddy += qty;
          groupedData[monthKey].quantity += qty;
          groupedData[monthKey].totalAmount += item.totalAmount || item.totalPrice || 0;
        } else if (isRiceSale) {
          // For rice sales, track quantity and total amount
          const qty = item.quantity || item.riceQuantity || 0;
          groupedData[monthKey].rice += qty;
          groupedData[monthKey].quantity += qty;
          groupedData[monthKey].totalAmount += item.totalAmount || item.totalPrice || 0;
        } else if (isRiceReport) {
          const qty = item.quantity || item.riceQuantity || 0;
          groupedData[monthKey].rice += qty;
          groupedData[monthKey].quantity += qty;
        } else if (isPaddyReport) {
          const qty = item.quantity || item.paddyQuantity || 0;
          groupedData[monthKey].paddy += qty;
          groupedData[monthKey].quantity += qty;
        }
      });

      // Sort by month key and return
      return Object.entries(groupedData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, value]) => value);
    } catch (error) {
      console.error('Error generating chart data:', error);
      return [];
    }
  },

  getWarehouses: async () => {
    if (USE_MOCK) {
      return { data: ['Warehouse A', 'Warehouse B', 'Main Warehouse'] };
    }
    return axiosInstance.get('/reports/warehouses');
  },

  getPaddyTypes: async () => {
    if (USE_MOCK) {
      return { data: ['Nadu', 'Samba', 'Keeri Samba'] };
    }
    return axiosInstance.get('/reports/paddy-types');
  },

  getRiceTypes: async () => {
    if (USE_MOCK) {
      return { data: ['Basmati', 'Samba', 'Nadu'] };
    }
    return axiosInstance.get('/reports/rice-types');
  },

  getCustomers: async () => {
    if (USE_MOCK) {
      return { data: [] };
    }
    return axiosInstance.get('/reports/customers');
  },

  getSuppliers: async () => {
    if (USE_MOCK) {
      return { data: [] };
    }
    return axiosInstance.get('/reports/suppliers');
  }
};
