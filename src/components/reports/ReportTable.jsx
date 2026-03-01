import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Package, Droplets, Warehouse, User, Calendar, Tag, Wheat, Box, Scale } from 'lucide-react';
import { useState } from 'react';
import { formatDate, formatNumber, formatPercentage, formatCurrency } from '../../utils/formatters';

const ReportTable = ({ data = [], reportType, loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Determine report type (handle both uppercase and lowercase)
  const normalizedReportType = reportType?.toUpperCase() || '';
  const isPaddyThreshing = normalizedReportType.includes('PADDY_THRESHING');
  const isPaddySale = normalizedReportType.includes('PADDY_SALE');
  const isPaddyStock = normalizedReportType.includes('PADDY_STOCK');
  const isPaddyReport = normalizedReportType.includes('PADDY');
  const isRiceSale = normalizedReportType.includes('RICE_SALE');
  const isRiceStock = normalizedReportType.includes('RICE_STOCK');
  const isRiceReport = normalizedReportType.includes('RICE');

  // Columns for Paddy Threshing Report (most comprehensive)
  const paddyThreshingColumns = [
    { key: 'paddyType', label: 'Paddy Type', icon: Wheat },
    { key: 'paddyQuantity', label: 'Paddy Qty (kg)', icon: Scale },
    { key: 'riceType', label: 'Rice Type', icon: Package },
    { key: 'riceQuantity', label: 'Rice Qty (kg)', icon: Scale },
    { key: 'brokenRiceType', label: 'Broken Rice Type', icon: Box },
    { key: 'brokenRiceQuantity', label: 'Broken Qty (kg)', icon: Scale },
    { key: 'polishRiceType', label: 'Polish Rice Type', icon: Box },
    { key: 'polishRiceQuantity', label: 'Polish Qty (kg)', icon: Scale },
    { key: 'warehouse', label: 'Warehouse', icon: Warehouse },
    { key: 'user', label: 'User', icon: User },
    { key: 'date', label: 'Date', icon: Calendar }
  ];

  // Columns for Paddy Sale Report
  const paddySaleColumns = [
    { key: 'paddyType', label: 'Paddy Type', icon: Wheat },
    { key: 'quantity', label: 'Quantity (kg)', icon: Scale, fallback: 'paddyQuantity' },
    { key: 'pricePerKg', label: 'Price/kg', icon: Tag },
    { key: 'totalAmount', label: 'Total Price', icon: Tag, fallback: 'totalPrice' },
    { key: 'customerName', label: 'Customer', icon: User, fallback: 'customer' },
    { key: 'customerId', label: 'Customer ID', icon: User },
    { key: 'mobileNumber', label: 'Mobile', icon: User },
    { key: 'warehouse', label: 'Warehouse', icon: Warehouse },
    { key: 'date', label: 'Date', icon: Calendar }
  ];

  // Columns for Paddy Stock Report
  const paddyStockColumns = [
    { key: 'paddyType', label: 'Paddy Type', icon: Wheat },
    { key: 'quantity', label: 'Quantity (kg)', icon: Scale, fallback: 'paddyQuantity' },
    { key: 'moistureLevel', label: 'Moisture %', icon: Droplets },
    { key: 'warehouse', label: 'Warehouse', icon: Warehouse },
    { key: 'supplier', label: 'Supplier', icon: User, fallback: 'supplierName' },
    { key: 'user', label: 'Added By', icon: User },
    { key: 'date', label: 'Date', icon: Calendar }
  ];

  // Columns for Rice Sale Report
  const riceSaleColumns = [
    { key: 'riceType', label: 'Rice Type', icon: Package },
    { key: 'quantity', label: 'Quantity (kg)', icon: Scale, fallback: 'riceQuantity' },
    { key: 'pricePerKg', label: 'Price/kg', icon: Tag },
    { key: 'totalAmount', label: 'Total Price', icon: Tag, fallback: 'totalPrice' },
    { key: 'customerName', label: 'Customer', icon: User, fallback: 'customer' },
    { key: 'mobileNumber', label: 'Mobile', icon: User },
    { key: 'date', label: 'Date', icon: Calendar }
  ];

  // Columns for Rice Stock Report
  const riceStockColumns = [
    { key: 'riceType', label: 'Rice Type', icon: Package },
    { key: 'quantity', label: 'Quantity (kg)', icon: Scale, fallback: 'riceQuantity' },
    { key: 'pricePerKg', label: 'Price/kg', icon: Tag },
    { key: 'totalAmount', label: 'Total Amount', icon: Tag, fallback: 'totalPrice' },
    { key: 'supplierName', label: 'Supplier', icon: User, fallback: 'supplier' },
    { key: 'mobileNumber', label: 'Mobile', icon: User },
    { key: 'user', label: 'Added By', icon: User },
    { key: 'date', label: 'Date', icon: Calendar }
  ];

  // Select columns based on report type
  const getColumns = () => {
    if (isPaddyThreshing) return paddyThreshingColumns;
    if (isPaddySale) return paddySaleColumns;
    if (isPaddyStock) return paddyStockColumns;
    if (isRiceSale) return riceSaleColumns;
    if (isRiceStock) return riceStockColumns;
    // Default fallback
    if (isPaddyReport) return paddyStockColumns;
    if (isRiceReport) return riceStockColumns;
    return paddyThreshingColumns;
  };

  const columns = getColumns();

  // Get value with fallback support
  const getValue = (row, column) => {
    let value = row[column.key];
    // Try fallback if primary key is undefined/null
    if ((value === undefined || value === null) && column.fallback) {
      value = row[column.fallback];
    }
    return value;
  };

  const formatValue = (key, value) => {
    if (value === undefined || value === null || value === '') return 'N/A';

    switch (key) {
      case 'date':
        return formatDate(value);
      case 'quantity':
      case 'paddyQuantity':
      case 'riceQuantity':
      case 'brokenRiceQuantity':
      case 'polishRiceQuantity':
        return formatNumber(value) + ' kg';
      case 'moistureLevel':
        return formatPercentage(value);
      case 'pricePerKg':
      case 'totalPrice':
      case 'totalAmount':
        return formatCurrency(value);
      default:
        return value;
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-primary-500"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full
                      bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 mb-4">
          <Package className="w-8 h-8 text-gray-400 dark:text-white/40" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Results Found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your filters to see more results
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Container - Horizontal Scroll for Mobile */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-white/5 dark:to-white/10">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-white/80 uppercase tracking-wider"
                >
                  <div className="flex items-center gap-2">
                    <column.icon className="w-4 h-4" />
                    <span>{column.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-white/5 divide-y divide-gray-200 dark:divide-white/10">
            {currentData.map((row, rowIndex) => (
              <motion.tr
                key={row.id || rowIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                className="hover:bg-green-50/50 dark:hover:bg-white/5 transition-colors duration-150"
              >
                {columns.map((column) => {
                  const value = getValue(row, column);
                  return (
                    <td
                      key={column.key}
                      className="px-4 py-3 text-sm text-gray-900 dark:text-white/90 whitespace-nowrap"
                    >
                      {column.key === 'actionType' ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${value === 'Sale' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300' 
                            : value === 'Add Stock'
                            ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300'
                            : value === 'Threshing'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300'
                          }`}>
                          {value || 'N/A'}
                        </span>
                      ) : column.key === 'grade' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                       bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300">
                          {value || 'N/A'}
                        </span>
                      ) : column.key === 'paddyType' || column.key === 'riceType' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold
                                       bg-gradient-to-r from-green-100 to-emerald-100 text-green-800
                                       dark:from-green-500/20 dark:to-emerald-500/20 dark:text-green-300">
                          {value || 'N/A'}
                        </span>
                      ) : column.key === 'brokenRiceType' || column.key === 'polishRiceType' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                       bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          {value || 'N/A'}
                        </span>
                      ) : (
                        formatValue(column.key, value)
                      )}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm text-gray-700 dark:text-white/70">
            Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
            <span className="font-medium">{Math.min(endIndex, data.length)}</span> of{' '}
            <span className="font-medium">{data.length}</span> results
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10
                       text-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <motion.button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                        ${page === currentPage
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 dark:from-primary-500 dark:to-accent-500 text-white'
                          : 'bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10'
                        }`}
                    >
                      {page}
                    </motion.button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2 py-1.5 text-gray-500 dark:text-white/50">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <motion.button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10
                       text-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTable;
