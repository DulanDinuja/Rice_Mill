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

        const quantity = item.quantity || item.paddyQuantity || 0;
        groupedData[monthKey].quantity += quantity;

        if (reportType.includes('RICE')) {
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
