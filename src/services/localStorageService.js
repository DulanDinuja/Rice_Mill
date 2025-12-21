const STORAGE_KEYS = {
  RICE_SALES: 'rice_sales',
  PADDY_SALES: 'paddy_sales',
  RICE_STOCKS: 'rice_stocks',
  PADDY_STOCKS: 'paddy_stocks'
};

export const localStorageService = {
  // Generic storage methods
  getItem: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
      return false;
    }
  },

  // Sales methods
  getRiceSales: () => {
    return localStorageService.getItem(STORAGE_KEYS.RICE_SALES) || [];
  },

  savePaddySales: (sales) => {
    return localStorageService.setItem(STORAGE_KEYS.PADDY_SALES, sales);
  },

  getPaddySales: () => {
    return localStorageService.getItem(STORAGE_KEYS.PADDY_SALES) || [];
  },

  saveRiceSale: (sale) => {
    const sales = localStorageService.getRiceSales();
    const newSale = {
      ...sale,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    sales.push(newSale);
    localStorageService.setItem(STORAGE_KEYS.RICE_SALES, sales);
    return newSale;
  },

  savePaddySale: (sale) => {
    const sales = localStorageService.getPaddySales();
    const newSale = {
      ...sale,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    sales.push(newSale);
    localStorageService.setItem(STORAGE_KEYS.PADDY_SALES, sales);
    return newSale;
  },

  getAllSales: () => {
    const riceSales = localStorageService.getRiceSales().map(sale => ({
      ...sale,
      type: 'rice'
    }));
    const paddySales = localStorageService.getPaddySales().map(sale => ({
      ...sale,
      type: 'paddy'
    }));
    
    return [...riceSales, ...paddySales].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  },

  // Stock methods
  getRiceStocks: () => {
    return localStorageService.getItem(STORAGE_KEYS.RICE_STOCKS) || [];
  },

  saveRiceStocks: (stocks) => {
    return localStorageService.setItem(STORAGE_KEYS.RICE_STOCKS, stocks);
  },

  getPaddyStocks: () => {
    return localStorageService.getItem(STORAGE_KEYS.PADDY_STOCKS) || [];
  },

  savePaddyStocks: (stocks) => {
    return localStorageService.setItem(STORAGE_KEYS.PADDY_STOCKS, stocks);
  },

  updateStockQuantity: (stockId, soldQuantity, stockType) => {
    const storageKey = stockType === 'rice' ? STORAGE_KEYS.RICE_STOCKS : STORAGE_KEYS.PADDY_STOCKS;
    const stocks = localStorageService.getItem(storageKey) || [];
    
    const updatedStocks = stocks.map(stock => {
      if (stock.id === parseInt(stockId)) {
        const newQuantity = stock.quantity - soldQuantity;
        return {
          ...stock,
          quantity: Math.max(0, newQuantity),
          status: newQuantity <= 0 ? 'Out of Stock' : 
                 newQuantity < 100 ? 'Low Stock' : 'In Stock',
          lastUpdated: new Date().toISOString()
        };
      }
      return stock;
    });
    
    localStorageService.setItem(storageKey, updatedStocks);
    return updatedStocks;
  }
};