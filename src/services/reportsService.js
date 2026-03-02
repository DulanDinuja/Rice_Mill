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

  // Get filtered system data by date range
  getFilteredSystemData: async (fromDate, toDate) => {
    if (USE_MOCK) {
      return { data: {} };
    }

    try {
      // Always fetch from stock APIs to calculate costs
      const [paddyStock, paddySale, paddyThreshing, riceStock, riceSale] = await Promise.all([
        reportsService.generateReport({ fromDate: fromDate || null, toDate: toDate || null, reportType: 'PADDY_STOCK' }),
        reportsService.generateReport({ fromDate: fromDate || null, toDate: toDate || null, reportType: 'PADDY_SALE' }),
        reportsService.generateReport({ fromDate: fromDate || null, toDate: toDate || null, reportType: 'PADDY_THRESHING' }),
        reportsService.generateReport({ fromDate: fromDate || null, toDate: toDate || null, reportType: 'RICE_STOCK' }),
        reportsService.generateReport({ fromDate: fromDate || null, toDate: toDate || null, reportType: 'RICE_SALE' })
      ]);

      // Calculate summary from filtered data
      let totalPaddyStock = 0;
      let totalRiceStock = 0;
      let totalBrokenRice = 0;
      let totalPolishRice = 0;
      let totalPaddySales = 0;
      let totalRiceSales = 0;

      // Process paddy stock
      const paddyData = {};
      let totalPaddyStockCost = 0;
      (paddyStock.data || []).forEach(item => {
        const type = item.paddyType || 'Unknown';
        if (!paddyData[type]) {
          paddyData[type] = { totalStock: 0, totalSales: 0, totalRevenue: 0, totalCost: 0 };
        }
        const quantity = item.quantity || item.paddyQuantity || 0;
        const pricePerKg = item.pricePerKg || 0;
        const cost = item.totalAmount || item.totalPrice || (quantity * pricePerKg) || 0;

        paddyData[type].totalStock += quantity;
        paddyData[type].totalCost += cost;
        totalPaddyStock += quantity;
        totalPaddyStockCost += cost;
      });

      // Process paddy sales
      (paddySale.data || []).forEach(item => {
        const type = item.paddyType || 'Unknown';
        if (!paddyData[type]) {
          paddyData[type] = { totalStock: 0, totalSales: 0, totalRevenue: 0, totalCost: 0 };
        }
        const quantity = item.quantity || item.paddyQuantity || 0;
        const pricePerKg = item.pricePerKg || 0;
        const amount = item.totalAmount || item.totalPrice || (quantity * pricePerKg) || 0;

        paddyData[type].totalSales += quantity;
        paddyData[type].totalRevenue += amount;
        totalPaddySales += amount;
      });

      // Process threshing
      const threshingData = paddyThreshing.data || [];
      threshingData.forEach(item => {
        totalRiceStock += item.riceQuantity || 0;
        totalBrokenRice += item.brokenRiceQuantity || 0;
        totalPolishRice += item.polishRiceQuantity || 0;
      });

      // Process rice stock
      const riceData = {};
      let totalRiceStockCost = 0;
      (riceStock.data || []).forEach(item => {
        const type = item.riceType || 'Unknown';
        if (!riceData[type]) {
          riceData[type] = { totalStock: 0, totalSales: 0, totalRevenue: 0, totalBrokenRice: 0, totalPolishRice: 0, totalCost: 0 };
        }
        const quantity = item.quantity || item.riceQuantity || 0;
        const pricePerKg = item.pricePerKg || 0;
        const cost = item.totalAmount || item.totalPrice || (quantity * pricePerKg) || 0;

        riceData[type].totalStock += quantity;
        riceData[type].totalCost += cost;
        totalRiceStockCost += cost;
      });

      // Process rice sales
      (riceSale.data || []).forEach(item => {
        const type = item.riceType || 'Unknown';
        if (!riceData[type]) {
          riceData[type] = { totalStock: 0, totalSales: 0, totalRevenue: 0, totalBrokenRice: 0, totalPolishRice: 0, totalCost: 0 };
        }
        const quantity = item.quantity || item.riceQuantity || 0;
        const pricePerKg = item.pricePerKg || 0;
        const amount = item.totalAmount || item.totalPrice || (quantity * pricePerKg) || 0;

        riceData[type].totalSales += quantity;
        riceData[type].totalRevenue += amount;
        totalRiceSales += amount;
      });

      return {
        data: {
          summary: {
            totalPaddyStock,
            totalRiceStock,
            totalBrokenRice,
            totalPolishRice,
            totalPaddySales,
            totalRiceSales,
            totalPaddyStockCost,
            totalRiceStockCost
          },
          paddyData,
          riceData,
          threshingData
        }
      };
    } catch (error) {
      console.error('Error fetching filtered system data:', error);
      return { data: {} };
    }
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
    try {
      // Fetch customers from paddy and rice sales
      const [paddySaleRes, riceSaleRes] = await Promise.all([
        axiosInstance.get('/paddy/paddysale'),
        axiosInstance.get('/rice/ricesale')
      ]);

      const customersMap = new Map();

      // Extract customers from paddy sales
      (paddySaleRes.data || []).forEach(sale => {
        const name = sale.customerName || sale.customer;
        const id = sale.customerId || sale.nic || '';
        const mobile = sale.mobileNumber || '';
        if (name && name !== 'N/A') {
          const key = `${name}-${id}`;
          if (!customersMap.has(key)) {
            customersMap.set(key, { name, id, mobile, type: 'customer' });
          }
        }
      });

      // Extract customers from rice sales
      (riceSaleRes.data || []).forEach(sale => {
        const name = sale.customerName || sale.customer;
        const id = sale.customerId || sale.nic || '';
        const mobile = sale.mobileNumber || '';
        if (name && name !== 'N/A') {
          const key = `${name}-${id}`;
          if (!customersMap.has(key)) {
            customersMap.set(key, { name, id, mobile, type: 'customer' });
          }
        }
      });

      return { data: Array.from(customersMap.values()) };
    } catch (error) {
      console.error('Error fetching customers:', error);
      return { data: [] };
    }
  },

  getSuppliers: async () => {
    if (USE_MOCK) {
      return { data: [] };
    }
    try {
      // Fetch suppliers from paddy and rice stock additions
      const [paddyStockRes, riceStockRes, paddySaleRes, riceSaleRes] = await Promise.all([
        axiosInstance.get('/paddy/addstock'),
        axiosInstance.get('/rice/addstock'),
        axiosInstance.get('/paddy/paddysale'),
        axiosInstance.get('/rice/ricesale')
      ]);

      const suppliersMap = new Map();

      // Extract suppliers from paddy stock
      (paddyStockRes.data || []).forEach(stock => {
        const name = stock.supplierName || stock.supplier || stock.customerName || '';
        const id = stock.supplierId || stock.customerId || stock.nic || '';
        const mobile = stock.mobileNumber || '';
        // Only exclude 'Threshing' and empty names
        if (name && name.trim() !== '' && name.toLowerCase() !== 'threshing' && name.toLowerCase() !== 'n/a') {
          const key = `${name.trim()}-${id}`;
          if (!suppliersMap.has(key)) {
            suppliersMap.set(key, { name: name.trim(), id, mobile, type: 'supplier' });
          }
        }
      });

      // Extract suppliers from rice stock (excluding threshing entries)
      (riceStockRes.data || []).forEach(stock => {
        const name = stock.supplierName || stock.supplier || stock.customerName || '';
        const id = stock.supplierId || stock.customerId || stock.nic || '';
        const mobile = stock.mobileNumber || '';
        if (name && name.trim() !== '' && name.toLowerCase() !== 'threshing' && name.toLowerCase() !== 'n/a') {
          const key = `${name.trim()}-${id}`;
          if (!suppliersMap.has(key)) {
            suppliersMap.set(key, { name: name.trim(), id, mobile, type: 'supplier' });
          }
        }
      });

      // Also include customers from sales (for sale reports)
      (paddySaleRes.data || []).forEach(sale => {
        const name = sale.customerName || sale.customer || '';
        const id = sale.customerId || sale.nic || '';
        const mobile = sale.mobileNumber || '';
        if (name && name.trim() !== '' && name.toLowerCase() !== 'n/a') {
          const key = `${name.trim()}-${id}`;
          if (!suppliersMap.has(key)) {
            suppliersMap.set(key, { name: name.trim(), id, mobile, type: 'customer' });
          }
        }
      });

      (riceSaleRes.data || []).forEach(sale => {
        const name = sale.customerName || sale.customer || '';
        const id = sale.customerId || sale.nic || '';
        const mobile = sale.mobileNumber || '';
        if (name && name.trim() !== '' && name.toLowerCase() !== 'n/a') {
          const key = `${name.trim()}-${id}`;
          if (!suppliersMap.has(key)) {
            suppliersMap.set(key, { name: name.trim(), id, mobile, type: 'customer' });
          }
        }
      });

      return { data: Array.from(suppliersMap.values()) };
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      return { data: [] };
    }
  }
};
