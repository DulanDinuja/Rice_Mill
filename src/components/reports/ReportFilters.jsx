import { motion } from 'framer-motion';
import { Calendar, Filter, Download } from 'lucide-react';
import { REPORT_TYPES } from '../../services/reportsService';
import { PADDY_TYPES, RICE_TYPES } from '../../utils/constants';

const ReportFilters = ({
  filters,
  onFilterChange,
  onGenerateReport,
  onExportReport,
  warehouses = [],
  suppliers = [],
  loading = false
}) => {
  const reportTypeOptions = [
    { value: '', label: 'Select Report Type', disabled: true },
    { value: 'divider1', label: '--- Paddy Reports ---', disabled: true },
    { value: REPORT_TYPES.PADDY_THRESHING, label: '1. Paddy Threshing Report' },
    { value: REPORT_TYPES.PADDY_SALE, label: '2. Paddy Sale Report' },
    { value: REPORT_TYPES.PADDY_ADD_STOCK, label: '3. Paddy Add Stock Report' },
    { value: 'divider2', label: '--- Rice Reports ---', disabled: true },
    { value: REPORT_TYPES.RICE_SALE, label: '4. Rice Sale Report' },
    { value: REPORT_TYPES.RICE_ADD_STOCK, label: '5. Rice Add Stock Report' }
  ];

  const quickDateRanges = [
    { label: 'Today', value: 'today' },
    { label: 'This Month', value: 'month' },
    { label: 'Last 6 Months', value: '6months' },
    { label: 'This Year', value: 'year' }
  ];

  const handleQuickDate = (rangeType) => {
    const today = new Date();
    let fromDate;

    switch (rangeType) {
      case 'today':
        fromDate = today;
        break;
      case 'month':
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case '6months':
        fromDate = new Date(today.setMonth(today.getMonth() - 6));
        break;
      case 'year':
        fromDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        fromDate = today;
    }

    onFilterChange({
      ...filters,
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0]
    });
  };

  const isPaddyReport = filters.reportType?.includes('paddy');
  const isRiceReport = filters.reportType?.includes('rice');

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 dark:bg-white/[0.08] border border-gray-200 dark:border-white/[0.12] backdrop-blur-xl rounded-2xl p-4 md:p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-primary-500/20 dark:to-accent-500/20 rounded-xl">
          <Filter className="w-5 h-5 text-green-600 dark:text-primary-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Report Filters</h2>
      </div>

      {/* Quick Date Range Buttons */}
      <div className="flex flex-wrap gap-2">
        {quickDateRanges.map((range) => (
          <motion.button
            key={range.value}
            onClick={() => handleQuickDate(range.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 text-sm bg-gradient-to-r from-green-50 to-emerald-50 dark:from-primary-500/10 dark:to-accent-500/10
                     text-green-700 dark:text-primary-300 rounded-lg border border-green-200 dark:border-primary-500/30
                     hover:from-green-100 hover:to-emerald-100 dark:hover:from-primary-500/20 dark:hover:to-accent-500/20
                     transition-all duration-200"
          >
            {range.label}
          </motion.button>
        ))}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* From Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-white/80">
            From Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-white/50" />
            <input
              type="date"
              value={filters.fromDate || ''}
              onChange={(e) => onFilterChange({ ...filters, fromDate: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10
                       text-gray-900 dark:text-white rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-green-500/30 dark:focus:ring-primary-500/30
                       focus:border-green-500 dark:focus:border-primary-500
                       transition-all duration-200"
            />
          </div>
        </div>

        {/* To Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-white/80">
            To Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-white/50" />
            <input
              type="date"
              value={filters.toDate || ''}
              onChange={(e) => onFilterChange({ ...filters, toDate: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10
                       text-gray-900 dark:text-white rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-green-500/30 dark:focus:ring-primary-500/30
                       focus:border-green-500 dark:focus:border-primary-500
                       transition-all duration-200"
            />
          </div>
        </div>

        {/* Report Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-white/80">
            Report Type <span className="text-red-500">*</span>
          </label>
          <select
            value={filters.reportType || ''}
            onChange={(e) => onFilterChange({ ...filters, reportType: e.target.value })}
            className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10
                     text-gray-900 dark:text-white rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-green-500/30 dark:focus:ring-primary-500/30
                     focus:border-green-500 dark:focus:border-primary-500
                     transition-all duration-200"
          >
            {reportTypeOptions.map((option, index) => (
              <option
                key={`report-type-${index}`}
                value={option.value}
                disabled={option.disabled}
                className="bg-white dark:bg-gray-800"
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Warehouse Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-white/80">
            Warehouse (Optional)
          </label>
          <select
            value={filters.warehouse || ''}
            onChange={(e) => onFilterChange({ ...filters, warehouse: e.target.value })}
            className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10
                     text-gray-900 dark:text-white rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-green-500/30 dark:focus:ring-primary-500/30
                     focus:border-green-500 dark:focus:border-primary-500
                     transition-all duration-200"
          >
            <option value="" className="bg-white dark:bg-gray-800">All Warehouses</option>
            {Array.isArray(warehouses) && warehouses.map((warehouse, index) => (
              <option key={`warehouse-${index}`} value={warehouse} className="bg-white dark:bg-gray-800">
                {warehouse}
              </option>
            ))}
          </select>
        </div>

        {/* Paddy Type Filter - Show only for paddy reports */}
        {isPaddyReport && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-white/80">
              Paddy Type (Optional)
            </label>
            <select
              value={filters.paddyType || ''}
              onChange={(e) => onFilterChange({ ...filters, paddyType: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10
                       text-gray-900 dark:text-white rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-green-500/30 dark:focus:ring-primary-500/30
                       focus:border-green-500 dark:focus:border-primary-500
                       transition-all duration-200"
            >
              <option value="" className="bg-white dark:bg-gray-800">All Paddy Types</option>
              {PADDY_TYPES.map((type, index) => (
                <option key={`paddy-${index}`} value={type} className="bg-white dark:bg-gray-800">
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Rice Type Filter - Show only for rice reports */}
        {isRiceReport && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-white/80">
              Rice Type (Optional)
            </label>
            <select
              value={filters.riceType || ''}
              onChange={(e) => onFilterChange({ ...filters, riceType: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10
                       text-gray-900 dark:text-white rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-green-500/30 dark:focus:ring-primary-500/30
                       focus:border-green-500 dark:focus:border-primary-500
                       transition-all duration-200"
            >
              <option value="" className="bg-white dark:bg-gray-800">All Rice Types</option>
              {RICE_TYPES.map((type, index) => (
                <option key={`rice-${index}`} value={type} className="bg-white dark:bg-gray-800">
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Supplier/Customer Filter - Show for all reports except Paddy Threshing Report */}
        {filters.reportType && filters.reportType !== REPORT_TYPES.PADDY_THRESHING && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-white/80">
              {(filters.reportType === REPORT_TYPES.PADDY_SALE || filters.reportType === REPORT_TYPES.RICE_SALE)
                ? 'Customer (Optional)'
                : 'Supplier (Optional)'}
            </label>
            <select
              value={filters.supplier || ''}
              onChange={(e) => onFilterChange({ ...filters, supplier: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10
                       text-gray-900 dark:text-white rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-green-500/30 dark:focus:ring-primary-500/30
                       focus:border-green-500 dark:focus:border-primary-500
                       transition-all duration-200"
            >
              <option value="" className="bg-white dark:bg-gray-800">
                {(filters.reportType === REPORT_TYPES.PADDY_SALE || filters.reportType === REPORT_TYPES.RICE_SALE)
                  ? 'All Customers'
                  : 'All Suppliers'}
              </option>
              {Array.isArray(suppliers) && suppliers.map((supplier, index) => (
                <option key={`supplier-${index}`} value={supplier} className="bg-white dark:bg-gray-800">
                  {supplier}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-2">
        <motion.button
          onClick={onGenerateReport}
          disabled={!filters.reportType || loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600
                   dark:from-primary-500 dark:to-accent-500 text-white rounded-xl font-medium
                   hover:from-green-700 hover:to-emerald-700 dark:hover:from-primary-600 dark:hover:to-accent-600
                   disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Filter className="w-4 h-4" />
          {loading ? 'Generating...' : 'Generate Report'}
        </motion.button>

        <motion.button
          onClick={onExportReport}
          disabled={!filters.reportType || loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600
                   dark:from-blue-500 dark:to-cyan-500 text-white rounded-xl font-medium
                   hover:from-blue-700 hover:to-cyan-700 dark:hover:from-blue-600 dark:hover:to-cyan-600
                   disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Download className="w-4 h-4" />
          Export Report
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ReportFilters;
