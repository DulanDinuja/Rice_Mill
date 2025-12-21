import { localStorageService } from './localStorageService';

export const salesService = {
  // Rice Sales
  createRiceSale: async (saleData) => {
    try {
      const savedSale = localStorageService.saveRiceSale(saleData);
      return {
        success: true,
        data: savedSale
      };
    } catch (error) {
      console.error('Rice sale creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  getRiceSales: async () => {
    try {
      const sales = localStorageService.getRiceSales();
      return {
        success: true,
        data: sales
      };
    } catch (error) {
      console.error('Failed to fetch rice sales:', error);
      return {
        success: false,
        data: []
      };
    }
  },

  // Paddy Sales
  createPaddySale: async (saleData) => {
    try {
      const savedSale = localStorageService.savePaddySale(saleData);
      return {
        success: true,
        data: savedSale
      };
    } catch (error) {
      console.error('Paddy sale creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  getPaddySales: async () => {
    try {
      const sales = localStorageService.getPaddySales();
      return {
        success: true,
        data: sales
      };
    } catch (error) {
      console.error('Failed to fetch paddy sales:', error);
      return {
        success: false,
        data: []
      };
    }
  },

  // Get all sales (rice + paddy)
  getAllSales: async () => {
    try {
      const allSales = localStorageService.getAllSales();
      return {
        success: true,
        data: allSales
      };
    } catch (error) {
      console.error('Failed to fetch all sales:', error);
      return {
        success: false,
        data: []
      };
    }
  },

  // Update stock after sale
  updateStockAfterSale: async (stockId, soldQuantity, stockType) => {
    try {
      localStorageService.updateStockQuantity(stockId, soldQuantity, stockType);
      return { success: true };
    } catch (error) {
      console.error('Stock update failed:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
};