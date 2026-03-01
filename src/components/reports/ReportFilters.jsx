import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Download, Printer, FileText, ChevronDown, Sparkles, RotateCcw, Search, Wheat, Box } from 'lucide-react';
import { REPORT_TYPES } from '../../services/reportsService';
import { PADDY_TYPES, RICE_TYPES } from '../../utils/constants';
import { useState } from 'react';

const ReportFilters = ({
  filters,
  onFilterChange,
  onGenerateReport,
  onExportReport,
  onPrintReport,
  warehouses = [],
  suppliers = [],
  loading = false
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeQuickDate, setActiveQuickDate] = useState(null);

  const reportTypeOptions = [
    { value: '', label: 'Select Report Type', disabled: true, icon: null },
    { value: 'divider1', label: 'Paddy Reports', disabled: true, isDivider: true },
    { value: REPORT_TYPES.PADDY_THRESHING, label: 'Paddy Threshing Report', icon: '🌾' },
    { value: REPORT_TYPES.PADDY_SALE, label: 'Paddy Sale Report', icon: '💰' },
    { value: REPORT_TYPES.PADDY_STOCK, label: 'Paddy Stock Report', icon: '📦' },
    { value: 'divider2', label: 'Rice Reports', disabled: true, isDivider: true },
    { value: REPORT_TYPES.RICE_SALE, label: 'Rice Sale Report', icon: '🍚' },
    { value: REPORT_TYPES.RICE_STOCK, label: 'Rice Stock Report', icon: '📊' }
  ];

  const quickDateRanges = [
    { label: 'Today', value: 'today', icon: '📅' },
    { label: 'This Week', value: 'week', icon: '📆' },
    { label: 'This Month', value: 'month', icon: '🗓️' },
    { label: 'Last 3 Months', value: '3months', icon: '📊' },
    { label: 'Last 6 Months', value: '6months', icon: '📈' },
    { label: 'This Year', value: 'year', icon: '🎯' },
    { label: 'All Time', value: 'all', icon: '♾️' }
  ];

  const handleQuickDate = (rangeType) => {
    setActiveQuickDate(rangeType);
    const today = new Date();
    let fromDate;

    switch (rangeType) {
      case 'today':
        fromDate = today;
        break;
      case 'week':
        fromDate = new Date(today.setDate(today.getDate() - today.getDay()));
        break;
      case 'month':
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case '3months':
        fromDate = new Date(new Date().setMonth(new Date().getMonth() - 3));
        break;
      case '6months':
        fromDate = new Date(new Date().setMonth(new Date().getMonth() - 6));
        break;
      case 'year':
        fromDate = new Date(today.getFullYear(), 0, 1);
        break;
      case 'all':
        onFilterChange({
          ...filters,
          fromDate: '',
          toDate: ''
        });
        return;
      default:
        fromDate = today;
    }

    onFilterChange({
      ...filters,
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleClearFilters = () => {
    setActiveQuickDate(null);
    onFilterChange({
      fromDate: '',
      toDate: '',
      reportType: '',
      warehouse: '',
      paddyType: '',
      riceType: '',
      supplier: ''
    });
  };

  const isPaddyReport = filters.reportType?.includes('paddy');
  const isRiceReport = filters.reportType?.includes('rice');

  const getSelectedReportLabel = () => {
    const selected = reportTypeOptions.find(opt => opt.value === filters.reportType);
    return selected ? selected.label : 'Select Report Type';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      {/* Main Container with Gradient Border */}
      <div className="relative bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
                    rounded-3xl shadow-2xl border border-gray-200/50 dark:border-white/10">

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/5 to-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/5 to-cyan-500/10 rounded-full blur-3xl" />

        {/* Header Section */}
        <div className="relative z-10 p-4 md:p-6 border-b border-gray-200/50 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Animated Icon */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl blur-lg opacity-40" />
                <div className="relative p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </motion.div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-700
                             dark:from-white dark:via-green-200 dark:to-emerald-300 bg-clip-text text-transparent">
                  Report Generator
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Generate, analyze, and export detailed reports
                </p>
              </div>
            </div>

            {/* Toggle & Clear Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleClearFilters}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400
                         hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10
                         rounded-xl transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </motion.button>

              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/10
                         text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200
                         hover:bg-gray-200 dark:hover:bg-white/20"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
                <span className="hidden sm:inline">{isExpanded ? 'Collapse' : 'Expand'}</span>
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="relative z-10 p-4 md:p-6 space-y-6">

                {/* Quick Date Range Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quick Date Selection</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickDateRanges.map((range) => (
                      <motion.button
                        key={range.value}
                        onClick={() => handleQuickDate(range.value)}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className={`
                          group relative px-4 py-2.5 text-sm font-medium rounded-xl
                          transition-all duration-300 overflow-hidden
                          ${activeQuickDate === range.value
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                            : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-green-300 dark:hover:border-green-500/30 hover:shadow-md'
                          }
                        `}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <span>{range.icon}</span>
                          <span>{range.label}</span>
                        </span>
                        {activeQuickDate !== range.value && (
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-gray-50 dark:bg-gray-800 px-4 text-sm text-gray-500 dark:text-gray-400">
                      or customize filters
                    </span>
                  </div>
                </div>

                {/* Filter Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                  {/* Report Type - Full Width on Mobile, Prominent */}
                  <div className="md:col-span-2 lg:col-span-1">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="relative p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10
                               rounded-2xl border-2 border-green-200 dark:border-green-500/30 shadow-sm"
                    >
                      <label className="flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400 mb-3">
                        <FileText className="w-4 h-4" />
                        Report Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={filters.reportType || ''}
                        onChange={(e) => onFilterChange({ ...filters, reportType: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-500/40
                                 text-gray-900 dark:text-white rounded-xl font-medium
                                 focus:outline-none focus:ring-2 focus:ring-green-500/50 dark:focus:ring-green-500/50
                                 focus:border-green-500 dark:focus:border-green-500
                                 transition-all duration-200 cursor-pointer"
                      >
                        {reportTypeOptions.map((option, index) => (
                          <option
                            key={`report-type-${index}`}
                            value={option.value}
                            disabled={option.disabled}
                            className={`bg-white dark:bg-gray-800 ${option.isDivider ? 'font-bold text-gray-400' : ''}`}
                          >
                            {option.icon ? `${option.icon} ${option.label}` : option.label}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  </div>

                  {/* Date Range Card */}
                  <div className="md:col-span-2 lg:col-span-2">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="relative p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10
                               rounded-2xl border border-blue-200 dark:border-blue-500/30 shadow-sm"
                    >
                      <label className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">
                        <Calendar className="w-4 h-4" />
                        Date Range
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {/* From Date */}
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400 font-medium">From</span>
                          <input
                            type="date"
                            value={filters.fromDate || ''}
                            onChange={(e) => onFilterChange({ ...filters, fromDate: e.target.value })}
                            className="w-full pl-14 pr-4 py-3 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-500/30
                                     text-gray-900 dark:text-white rounded-xl
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/40
                                     focus:border-blue-500 dark:focus:border-blue-500
                                     transition-all duration-200"
                          />
                        </div>
                        {/* To Date */}
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400 font-medium">To</span>
                          <input
                            type="date"
                            value={filters.toDate || ''}
                            onChange={(e) => onFilterChange({ ...filters, toDate: e.target.value })}
                            className="w-full pl-14 pr-4 py-3 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-500/30
                                     text-gray-900 dark:text-white rounded-xl
                                     focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/40
                                     focus:border-blue-500 dark:focus:border-blue-500
                                     transition-all duration-200"
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Additional Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                  {/* Warehouse Filter */}
                  <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Box className="w-4 h-4 text-purple-500" />
                      Warehouse
                    </label>
                    <select
                      value={filters.warehouse || ''}
                      onChange={(e) => onFilterChange({ ...filters, warehouse: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10
                               text-gray-900 dark:text-white rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:focus:ring-purple-500/30
                               focus:border-purple-500 dark:focus:border-purple-500
                               transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-500/30"
                    >
                      <option value="" className="bg-white dark:bg-gray-800">All Warehouses</option>
                      {Array.isArray(warehouses) && warehouses.map((warehouse, index) => (
                        <option key={`warehouse-${index}`} value={warehouse} className="bg-white dark:bg-gray-800">
                          {warehouse}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Paddy Type Filter */}
                  {isPaddyReport && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className="space-y-2"
                    >
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Wheat className="w-4 h-4 text-amber-500" />
                        Paddy Type
                      </label>
                      <select
                        value={filters.paddyType || ''}
                        onChange={(e) => onFilterChange({ ...filters, paddyType: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10
                                 text-gray-900 dark:text-white rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:focus:ring-amber-500/30
                                 focus:border-amber-500 dark:focus:border-amber-500
                                 transition-all duration-200 hover:border-amber-300 dark:hover:border-amber-500/30"
                      >
                        <option value="" className="bg-white dark:bg-gray-800">All Paddy Types</option>
                        {PADDY_TYPES.map((type, index) => (
                          <option key={`paddy-${index}`} value={type} className="bg-white dark:bg-gray-800">
                            {type}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  )}

                  {/* Rice Type Filter */}
                  {isRiceReport && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className="space-y-2"
                    >
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Box className="w-4 h-4 text-indigo-500" />
                        Rice Type
                      </label>
                      <select
                        value={filters.riceType || ''}
                        onChange={(e) => onFilterChange({ ...filters, riceType: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10
                                 text-gray-900 dark:text-white rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-500/30
                                 focus:border-indigo-500 dark:focus:border-indigo-500
                                 transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-500/30"
                      >
                        <option value="" className="bg-white dark:bg-gray-800">All Rice Types</option>
                        {RICE_TYPES.map((type, index) => (
                          <option key={`rice-${index}`} value={type} className="bg-white dark:bg-gray-800">
                            {type}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  )}

                  {/* Supplier/Customer Filter */}
                  {filters.reportType && filters.reportType !== REPORT_TYPES.PADDY_THRESHING && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className="space-y-2"
                    >
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Search className="w-4 h-4 text-cyan-500" />
                        {(filters.reportType === REPORT_TYPES.PADDY_SALE || filters.reportType === REPORT_TYPES.RICE_SALE)
                          ? 'Customer'
                          : 'Supplier'}
                      </label>
                      <select
                        value={filters.supplier || ''}
                        onChange={(e) => onFilterChange({ ...filters, supplier: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10
                                 text-gray-900 dark:text-white rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:focus:ring-cyan-500/30
                                 focus:border-cyan-500 dark:focus:border-cyan-500
                                 transition-all duration-200 hover:border-cyan-300 dark:hover:border-cyan-500/30"
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
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons Section - Always Visible */}
        <div className="relative z-10 p-4 md:p-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-800/50 dark:via-gray-900/50 dark:to-gray-800/50
                      border-t border-gray-200/50 dark:border-white/10 rounded-b-3xl">
          <div className="flex flex-wrap items-center justify-between gap-4">

            {/* Selected Report Info */}
            <div className="flex items-center gap-3">
              {filters.reportType && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-500/20
                           text-green-700 dark:text-green-400 rounded-xl text-sm font-medium"
                >
                  <FileText className="w-4 h-4" />
                  <span>{getSelectedReportLabel()}</span>
                </motion.div>
              )}
              {(filters.fromDate || filters.toDate) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="hidden md:flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-500/20
                           text-blue-700 dark:text-blue-400 rounded-xl text-sm"
                >
                  <Calendar className="w-3 h-3" />
                  <span>{filters.fromDate || 'Start'} → {filters.toDate || 'Now'}</span>
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {/* Generate Report Button */}
              <motion.button
                onClick={onGenerateReport}
                disabled={!filters.reportType || loading}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex items-center gap-2 px-6 py-3 overflow-hidden
                         bg-gradient-to-r from-green-500 via-green-600 to-emerald-600
                         text-white rounded-xl font-semibold
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40
                         transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Search className="relative z-10 w-4 h-4" />
                <span className="relative z-10">{loading ? 'Generating...' : 'Generate Report'}</span>
                {loading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="relative z-10 w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                )}
              </motion.button>

              {/* Export Button */}
              <motion.button
                onClick={onExportReport}
                disabled={!filters.reportType || loading}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex items-center gap-2 px-5 py-3 overflow-hidden
                         bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600
                         text-white rounded-xl font-semibold
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                         transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Download className="relative z-10 w-4 h-4" />
                <span className="relative z-10">Export CSV</span>
              </motion.button>

              {/* Print Button */}
              <motion.button
                onClick={onPrintReport}
                disabled={!filters.reportType || loading}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex items-center gap-2 px-5 py-3 overflow-hidden
                         bg-gradient-to-r from-purple-500 via-purple-600 to-violet-600
                         text-white rounded-xl font-semibold
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40
                         transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Printer className="relative z-10 w-4 h-4" />
                <span className="relative z-10">Print Report</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportFilters;
