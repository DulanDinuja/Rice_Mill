import axiosInstance from './api/axiosConfig';

const USE_MOCK = false;

export const dashboardService = {
  getTotalRiceStock: async () => {
    if (USE_MOCK) {
      return { data: { totalStock: 2500, percentageChange: 12, isIncrease: true } };
    }
    return axiosInstance.get('/dashboard/total-rice-stock');
  },

  getTotalPaddyStock: async () => {
    if (USE_MOCK) {
      return { data: { totalStock: 8500, percentageChange: 8, isIncrease: true } };
    }
    return axiosInstance.get('/dashboard/total-paddy-stock');
  },

  getTotalRevenue: async () => {
    if (USE_MOCK) {
      return { data: { totalRevenue: 250000, percentageChange: 15, isIncrease: true } };
    }
    return axiosInstance.get('/dashboard/total-revenue');
  },

  getTotalWarehouses: async () => {
    if (USE_MOCK) {
      return { data: { totalWarehouses: 2 } };
    }
    return axiosInstance.get('/dashboard/total-warehouses');
  },

  getRecentActivities: async () => {
    if (USE_MOCK) {
      return { data: [] };
    }
    return axiosInstance.get('/dashboard/recent-activities');
  },

  getLowStockAlerts: async () => {
    if (USE_MOCK) {
      return { data: [] };
    }
    return axiosInstance.get('/dashboard/low-stock-alerts');
  },

  getBrokenAndPolishRiceQuantity: async () => {
    if (USE_MOCK) {
      return { data: { brokenRiceQuantity: 0, polishRiceQuantity: 0 } };
    }
    return axiosInstance.get('/dashboard/broken-polish-rice');
  }
};
