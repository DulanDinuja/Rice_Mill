import axiosInstance from './axiosConfig';
import { mockRiceStocks, mockPaddyStocks } from '../mock/stockData';
import { localStorageService } from '../localStorageService';

const USE_MOCK = false;

export const stockService = {
  getRiceStocks: async () => {
    if (USE_MOCK) {
      let stocks = localStorageService.getRiceStocks();
      if (stocks.length === 0) {
        localStorageService.saveRiceStocks(mockRiceStocks);
        stocks = mockRiceStocks;
      }
      return { data: stocks };
    }
    // Only fetch addstock and sales - threshing rice is already added to addstock by backend
    const [addStockRes, saleStockRes] = await Promise.all([
      axiosInstance.get('/rice/addstock'),
      axiosInstance.get('/rice/ricesale')
    ]);

    const addStocks = (addStockRes.data || []).map(item => {
      // Check if this is a threshing entry
      const isThreshing = item.customerName === 'Threshing' ||
                          (item.customerName || '').toLowerCase().includes('threshing');
      return {
        ...item,
        transactionType: isThreshing ? 'Threshing' : 'Add Stock',
        lastUpdated: item.date,
        uniqueId: `addstock-${item.id}`
      };
    });

    const saleStocks = (saleStockRes.data || []).map(item => ({
      ...item,
      transactionType: 'Sale',
      lastUpdated: item.date,
      uniqueId: `sale-${item.id}`
    }));

    return { data: [...addStocks, ...saleStocks] };
  },

  getPaddyStocks: async () => {
    if (USE_MOCK) {
      let stocks = localStorageService.getPaddyStocks();
      if (stocks.length === 0) {
        localStorageService.savePaddyStocks(mockPaddyStocks);
        stocks = mockPaddyStocks;
      }
      return { data: stocks };
    }
    const [addStockRes, saleRes, threshingRes] = await Promise.all([
      axiosInstance.get('/paddy/addstock'),
      axiosInstance.get('/paddy/paddysale'),
      axiosInstance.get('/paddy/paddythreshing')
    ]);
    const addStocks = (addStockRes.data || []).map(item => ({ ...item, transactionType: 'Add Stock', lastUpdated: item.date, uniqueId: `addstock-${item.id}` }));
    const sales = (saleRes.data || []).map(item => ({ ...item, transactionType: 'Sale', lastUpdated: item.date, uniqueId: `sale-${item.id}` }));
    const threshings = (threshingRes.data || []).map(item => ({ ...item, quantity: item.PaddyQuantity || item.paddyQuantity, transactionType: 'Threshing', lastUpdated: item.date, uniqueId: `threshing-${item.id}` }));
    return { data: [...addStocks, ...sales, ...threshings] };
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
    return axiosInstance.put(`/rice/addstock/${id}`, data);
  },

  deleteRiceStock: async (id, deleteReason) => {
    if (USE_MOCK) {
      return { data: { success: true } };
    }
    return axiosInstance.delete(`/rice/addstock/${id}`, { data: { deleteReason } });
  },

  deleteRiceSale: async (id, deleteReason) => {
    if (USE_MOCK) {
      return { data: { success: true } };
    }
    return axiosInstance.delete(`/rice/ricesale/${id}`, { data: { deleteReason } });
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
    const response = await axiosInstance.post('/rice/addstock', stockData);
    return response;
  },

  addRiceSale: async (saleData) => {
    if (USE_MOCK) {
      return { data: { id: Date.now(), ...saleData } };
    }
    return axiosInstance.post('/rice/ricesale', saleData);
  },

  updateRiceSale: async (id, saleData) => {
    if (USE_MOCK) {
      return { data: { id, ...saleData } };
    }
    return axiosInstance.put(`/rice/ricesale/${id}`, saleData);
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
    return axiosInstance.post('/paddy/addstock', stockData);
  },

  addPaddySale: async (saleData) => {
    if (USE_MOCK) {
      return { data: { id: Date.now(), ...saleData } };
    }
    return axiosInstance.post('/paddy/paddysale', saleData);
  },

  addPaddyThreshing: async (threshingData) => {
    if (USE_MOCK) {
      return { data: { id: Date.now(), ...threshingData } };
    }
    return axiosInstance.post('/paddy/paddythreshing', threshingData);
  },

  updatePaddyStock: async (id, data) => {
    if (USE_MOCK) {
      const stocks = localStorageService.getPaddyStocks();
      const index = stocks.findIndex(stock => stock.id === id);
      if (index !== -1) {
        stocks[index] = {
          ...stocks[index],
          ...data,
          id,
          updatedAt: new Date().toISOString(),
          lastUpdated: data.lastUpdated || new Date().toISOString()
        };
        localStorageService.savePaddyStocks(stocks);
        return { data: stocks[index] };
      }
      return { data: { ...data, id } };
    }
    return axiosInstance.put(`/paddy/addstock/${id}`, data);
  },

  updatePaddySale: async (id, data) => {
    if (USE_MOCK) {
      return { data: { id, ...data } };
    }
    return axiosInstance.put(`/paddy/paddysale/${id}`, data);
  },

  updatePaddyThreshing: async (id, data) => {
    if (USE_MOCK) {
      return { data: { id, ...data } };
    }
    return axiosInstance.put(`/paddy/paddythreshing/${id}`, data);
  },

  deletePaddyStock: async (id, deleteReason) => {
    if (USE_MOCK) {
      const stocks = localStorageService.getPaddyStocks();
      const filteredStocks = stocks.filter(stock => stock.id !== id);
      localStorageService.savePaddyStocks(filteredStocks);
      return { data: { success: true } };
    }
    return axiosInstance.delete(`/paddy/addstock/${id}`, { params: { deleteReason } });
  },

  deletePaddySale: async (id, deleteReason) => {
    if (USE_MOCK) {
      return { data: { success: true } };
    }
    return axiosInstance.delete(`/paddy/paddysale/${id}`, { params: { deleteReason } });
  },

  deletePaddyThreshing: async (id, deleteReason) => {
    if (USE_MOCK) {
      return { data: { success: true } };
    }
    return axiosInstance.delete(`/paddy/paddythreshing/${id}`, { params: { deleteReason } });
  }
};
