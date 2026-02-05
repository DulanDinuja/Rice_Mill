import axiosInstance from './axiosConfig';
import { mockRiceStocks, mockPaddyStocks } from '../mock/stockData';
import { localStorageService } from '../localStorageService';

const USE_MOCK = true;

export const stockService = {
  getRiceStocks: async () => {
    if (USE_MOCK) {
      // Try to get from localStorage first, fallback to mock data
      let stocks = localStorageService.getRiceStocks();
      if (stocks.length === 0) {
        // Initialize with mock data if localStorage is empty
        localStorageService.saveRiceStocks(mockRiceStocks);
        stocks = mockRiceStocks;
      }
      return { data: stocks };
    }
    return axiosInstance.get('/rice-stocks');
  },

  getPaddyStocks: async () => {
    if (USE_MOCK) {
      // Try to get from localStorage first, fallback to mock data
      let stocks = localStorageService.getPaddyStocks();
      if (stocks.length === 0) {
        // Initialize with mock data if localStorage is empty
        localStorageService.savePaddyStocks(mockPaddyStocks);
        stocks = mockPaddyStocks;
      }
      return { data: stocks };
    }
    return axiosInstance.get('/paddy-stocks');
  },

  createRiceStock: async (data) => {
    if (USE_MOCK) {
      return { data: { ...data, id: Date.now() } };
    }
    return axiosInstance.post('/rice-stocks', data);
  },

  updateRiceStock: async (id, data) => {
    if (USE_MOCK) {
      return { data: { ...data, id } };
    }
    return axiosInstance.put(`/rice-stocks/${id}`, data);
  },

  deleteRiceStock: async (id) => {
    if (USE_MOCK) {
      return { data: { success: true } };
    }
    return axiosInstance.delete(`/rice-stocks/${id}`);
  },

  addRiceStock: async (stockData) => {
    if (USE_MOCK) {
      const stocks = localStorageService.getRiceStocks();
      const newStock = {
        id: Date.now(),
        ...stockData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUpdated: stockData.lastUpdated || new Date().toISOString(),
        status: stockData.status || 'In Stock'
      };
      stocks.push(newStock);
      localStorageService.saveRiceStocks(stocks);
      return { data: newStock };
    }
    return axiosInstance.post('/rice-stocks/add', stockData);
  },

  saveRiceStock: async (stockData) => {
    if (USE_MOCK) {
      const savedStock = {
        ...stockData,
        id: stockData.id || Date.now(),
        savedAt: new Date().toISOString(),
        status: 'saved'
      };
      return { data: savedStock };
    }
    return axiosInstance.post('/rice-stocks/save', stockData);
  },

  processRiceStock: async (stockId, processData) => {
    if (USE_MOCK) {
      const processedStock = {
        id: stockId,
        ...processData,
        processedAt: new Date().toISOString(),
        status: 'processed'
      };
      return { data: processedStock };
    }
    return axiosInstance.post(`/rice-stocks/${stockId}/process`, processData);
  },

  bulkSaveRiceStocks: async (stocksArray) => {
    if (USE_MOCK) {
      const savedStocks = stocksArray.map(stock => ({
        ...stock,
        id: stock.id || Date.now() + Math.random(),
        savedAt: new Date().toISOString(),
        status: 'bulk_saved'
      }));
      return { data: savedStocks };
    }
    return axiosInstance.post('/rice-stocks/bulk-save', { stocks: stocksArray });
  },

  addPaddyStock: async (stockData) => {
    if (USE_MOCK) {
      const stocks = localStorageService.getPaddyStocks();
      const newStock = {
        id: Date.now(),
        ...stockData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUpdated: stockData.lastUpdated || new Date().toISOString(),
        status: stockData.status || 'In Stock'
      };
      stocks.push(newStock);
      localStorageService.savePaddyStocks(stocks);
      return { data: newStock };
    }
    return axiosInstance.post('/paddy-stocks/add', stockData);
  }
};
