import { useState, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import ReportFilters from '../components/reports/ReportFilters';
import ReportTable from '../components/reports/ReportTable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { reportsService } from '../services/reportsService';
import { Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Reports = () => {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    reportType: '',
    warehouse: '',
    paddyType: '',
    riceType: '',
    supplier: ''
  });

  const [reportData, setReportData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Initialize warehouses and suppliers
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [warehousesRes, suppliersRes] = await Promise.all([
          reportsService.getWarehouses(),
          reportsService.getSuppliers()
        ]);
        setWarehouses(warehousesRes.data || []);
        setSuppliers(suppliersRes.data || []);
      } catch (error) {
        console.error('Error loading filters:', error);
        setWarehouses([]);
        setSuppliers([]);
      }
    };
    loadFilters();
  }, []);

  const handleGenerateReport = async () => {
    if (!filters.reportType) {
      alert('Please select a report type');
      return;
    }

    // Validate date range
    if (filters.fromDate && filters.toDate) {
      const from = new Date(filters.fromDate);
      const to = new Date(filters.toDate);
      if (from > to) {
        alert('From Date must be earlier than To Date');
        return;
      }
    }

    setLoading(true);
    try {
      const result = await reportsService.getReports(
        filters.fromDate,
        filters.toDate,
        filters.reportType,
        {
          warehouse: filters.warehouse,
          paddyType: filters.paddyType,
          riceType: filters.riceType,
          supplier: filters.supplier
        }
      );

      if (result.success) {
        setReportData(result.data);

        // Generate chart data
        const chart = await reportsService.getChartData(
          filters.fromDate,
          filters.toDate,
          filters.reportType
        );
        setChartData(chart);
      } else {
        alert('Error generating report: ' + result.error);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!filters.reportType || reportData.length === 0) {
      alert('Please generate a report first');
      return;
    }

    // Determine report type name
    const reportTypeNames = {
      paddy_threshing: 'Paddy Threshing Report',
      paddy_sale: 'Paddy Sale Report',
      paddy_add_stock: 'Paddy Add Stock Report',
      rice_sale: 'Rice Sale Report',
      rice_add_stock: 'Rice Add Stock Report'
    };

    const reportTypeName = reportTypeNames[filters.reportType] || 'Report';

    // Create CSV content
    const isPaddyReport = filters.reportType?.includes('paddy');
    const headers = isPaddyReport
      ? ['Paddy Type', 'Quantity', 'Moisture %', 'Warehouse', 'Supplier', 'Action Type', 'Date']
      : ['Rice Type', 'Grade', 'Quantity', 'Warehouse', 'Price/kg', 'Action Type', 'Date'];

    const rows = reportData.map(row => {
      if (isPaddyReport) {
        return [
          row.paddyType || 'N/A',
          row.quantity || 0,
          row.moistureLevel || 'N/A',
          row.warehouse || 'N/A',
          row.supplier || 'N/A',
          row.actionType || 'N/A',
          new Date(row.date).toLocaleDateString()
        ];
      } else {
        return [
          row.riceType || 'N/A',
          row.grade || 'N/A',
          row.quantity || 0,
          row.warehouse || 'N/A',
          row.pricePerKg || 'N/A',
          row.actionType || 'N/A',
          new Date(row.date).toLocaleDateString()
        ];
      }
    });

    const csvContent = [
      [reportTypeName],
      [`Generated: ${new Date().toLocaleString()}`],
      [`Date Range: ${filters.fromDate || 'All'} to ${filters.toDate || 'All'}`],
      [],
      headers,
      ...rows
    ].map(row => row.join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportTypeName.replace(/\s+/g, '_')}_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-gaming font-bold text-gray-900 dark:text-white mb-1 md:mb-2">
          Reports & Analytics
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          Generate detailed reports with custom filters
        </p>
      </div>

      {/* Filters Section */}
      <ReportFilters
        filters={filters}
        onFilterChange={setFilters}
        onGenerateReport={handleGenerateReport}
        onExportReport={handleExportReport}
        warehouses={warehouses}
        suppliers={suppliers}
        loading={loading}
      />

      {/* Summary Cards */}
      {reportData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10
                     border border-green-200 dark:border-green-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reportData.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10
                     border border-blue-200 dark:border-blue-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Quantity</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {reportData.reduce((sum, item) => sum + (item.quantity || 0), 0).toLocaleString()} kg
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10
                     border border-purple-200 dark:border-purple-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date Range</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {filters.fromDate || 'All'} - {filters.toDate || 'Today'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Chart Section */}
      {chartData.length > 0 && (
        <GlassCard>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-6">
            Stock Movement Summary
          </h3>
          <ResponsiveContainer width="100%" height={300} className="md:h-[400px]">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(46, 125, 50, 0.2)" className="dark:stroke-[rgba(255,255,255,0.1)]" />
              <XAxis dataKey="month" stroke="#2E7D32" className="dark:stroke-[#00FF88]" />
              <YAxis stroke="#2E7D32" className="dark:stroke-[#00FF88]" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid rgba(46, 125, 50, 0.3)',
                  borderRadius: '8px',
                  color: '#263238'
                }}
                className="dark:[&>div]:!bg-[rgba(26,26,46,0.9)] dark:[&>div]:!border-[rgba(0,255,136,0.3)] dark:[&>div]:!text-white"
              />
              <Legend />
              {filters.reportType?.includes('rice') && (
                <Bar dataKey="rice" fill="#2E7D32" className="dark:fill-[#00FF88]" name="Rice (kg)" />
              )}
              {filters.reportType?.includes('paddy') && (
                <Bar dataKey="paddy" fill="#66BB6A" className="dark:fill-[#8A2BE2]" name="Paddy (kg)" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* Report Table */}
      {(reportData.length > 0 || loading) && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
              Report Results
            </h3>
          </div>
          <ReportTable data={reportData} reportType={filters.reportType} loading={loading} />
        </GlassCard>
      )}
    </div>
  );
};

export default Reports;
