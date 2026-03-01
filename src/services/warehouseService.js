import axiosInstance from './api/axiosConfig';

const USE_MOCK = false;

export const warehouseService = {
  getWarehouseStats: async () => {
    if (USE_MOCK) {
      return { data: [] };
    }
    return axiosInstance.get('/warehouse/stats');
  }
};
