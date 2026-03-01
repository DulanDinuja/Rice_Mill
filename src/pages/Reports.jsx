import { useState, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import ReportFilters from '../components/reports/ReportFilters';
import ReportTable from '../components/reports/ReportTable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, Line, AreaChart, Area, ComposedChart } from 'recharts';
import { reportsService } from '../services/reportsService';
import { Download, FileText, TrendingUp, DollarSign, Wheat, Box, Package, Activity, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

// Color palette for charts
const COLORS = {
  green: '#2E7D32',
  greenLight: '#4CAF50',
  purple: '#8B5CF6',
  purpleLight: '#A78BFA',
  orange: '#F97316',
  orangeLight: '#FB923C',
  blue: '#3B82F6',
  blueLight: '#60A5FA'
};

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
  const [systemData, setSystemData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Initialize warehouses and suppliers
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [warehousesRes, suppliersRes, systemDataRes] = await Promise.all([
          reportsService.getWarehouses(),
          reportsService.getSuppliers(),
          reportsService.getAllSystemData()
        ]);
        setWarehouses(warehousesRes.data || []);
        setSuppliers(suppliersRes.data || []);
        setSystemData(systemDataRes.data);
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

      {/* System Summary Cards */}
      {systemData && systemData.summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Paddy Stock Card - Green */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10
                     border border-green-200 dark:border-green-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Wheat className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Paddy Stock</p>
                <p className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-400">
                  {(systemData.summary?.totalPaddyStock || 0).toLocaleString()} kg
                </p>
              </div>
            </div>
          </motion.div>

          {/* Rice Stock Card - Purple */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-500/10 dark:to-violet-500/10
                     border border-purple-200 dark:border-purple-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Box className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Rice Stock</p>
                <p className="text-xl md:text-2xl font-bold text-purple-700 dark:text-purple-400">
                  {(systemData.summary?.totalRiceStock || 0).toLocaleString()} kg
                </p>
              </div>
            </div>
          </motion.div>

          {/* Paddy Sales Card - Orange */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10
                     border border-orange-200 dark:border-orange-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Paddy Sales Revenue</p>
                <p className="text-xl md:text-2xl font-bold text-orange-700 dark:text-orange-400">
                  Rs. {(systemData.summary?.totalPaddySales || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Rice Sales Card - Blue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10
                     border border-blue-200 dark:border-blue-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Rice Sales Revenue</p>
                <p className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400">
                  Rs. {(systemData.summary?.totalRiceSales || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Additional Stock Info Cards */}
      {systemData && systemData.summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Broken Rice - Green Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#2E7D32]/10 border border-[#2E7D32]/20 dark:bg-green-500/10 dark:border-green-500/20 rounded-xl p-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-[#2E7D32] dark:text-green-400 font-medium">Total Broken Rice:</span>
              <span className="text-[#2E7D32] dark:text-green-400 text-xl font-bold">
                {(systemData.summary?.totalBrokenRice || 0).toLocaleString()} kg
              </span>
            </div>
          </motion.div>

          {/* Polish Rice - Green Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-[#2E7D32]/10 border border-[#2E7D32]/20 dark:bg-green-500/10 dark:border-green-500/20 rounded-xl p-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-[#2E7D32] dark:text-green-400 font-medium">Total Polish Rice:</span>
              <span className="text-[#2E7D32] dark:text-green-400 text-xl font-bold">
                {(systemData.summary?.totalPolishRice || 0).toLocaleString()} kg
              </span>
            </div>
          </motion.div>

          {/* Total Revenue - Green Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#2E7D32]/10 border border-[#2E7D32]/20 dark:bg-green-500/10 dark:border-green-500/20 rounded-xl p-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-[#2E7D32] dark:text-green-400 font-medium">Total Revenue:</span>
              <span className="text-[#2E7D32] dark:text-green-400 text-xl font-bold">
                Rs. {((systemData.summary?.totalPaddySales || 0) + (systemData.summary?.totalRiceSales || 0)).toLocaleString()}
              </span>
            </div>
          </motion.div>
        </div>
      )}

      {/* System Overview Charts */}
      {systemData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <GlassCard>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">Stock Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Paddy Stock', value: systemData.summary?.totalPaddyStock || 0, fill: '#2E7D32' },
                { name: 'Rice Stock', value: systemData.summary?.totalRiceStock || 0, fill: '#8B5CF6' },
                { name: 'Broken Rice', value: systemData.summary?.totalBrokenRice || 0, fill: '#F97316' },
                { name: 'Polish Rice', value: systemData.summary?.totalPolishRice || 0, fill: '#3B82F6' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(46, 125, 50, 0.2)" />
                <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 12 }} />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(46, 125, 50, 0.3)',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value.toLocaleString()} kg`, 'Quantity']}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {[
                    { name: 'Paddy Stock', fill: '#2E7D32' },
                    { name: 'Rice Stock', fill: '#8B5CF6' },
                    { name: 'Broken Rice', fill: '#F97316' },
                    { name: 'Polish Rice', fill: '#3B82F6' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">Revenue Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Paddy Sales', value: systemData.summary?.totalPaddySales || 0 },
                    { name: 'Rice Sales', value: systemData.summary?.totalRiceSales || 0 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#F97316" />
                  <Cell fill="#3B82F6" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(46, 125, 50, 0.3)',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`Rs. ${value.toLocaleString()}`, 'Revenue']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      )}

      {/* Inventory by Type Charts */}
      {systemData && (systemData.paddyData || systemData.riceData) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Paddy Stock by Type */}
          {systemData.paddyData && Object.keys(systemData.paddyData).length > 0 && (
            <GlassCard>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                <span className="flex items-center gap-2">
                  <Wheat className="w-5 h-5 text-green-600" />
                  Paddy Stock by Type
                </span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(systemData.paddyData).map(([type, data]) => ({
                  name: type,
                  stock: data.totalStock || 0,
                  sales: data.totalSales || 0,
                  revenue: data.totalRevenue || 0
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(46, 125, 50, 0.2)" />
                  <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: '1px solid rgba(46, 125, 50, 0.3)',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => [
                      name === 'revenue' ? `Rs. ${value.toLocaleString()}` : `${value.toLocaleString()} kg`,
                      name === 'stock' ? 'Stock' : name === 'sales' ? 'Sold' : 'Revenue'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="stock" name="Stock (kg)" fill="#2E7D32" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sales" name="Sold (kg)" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          )}

          {/* Rice Stock by Type */}
          {systemData.riceData && Object.keys(systemData.riceData).length > 0 && (
            <GlassCard>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                <span className="flex items-center gap-2">
                  <Box className="w-5 h-5 text-purple-600" />
                  Rice Stock by Type
                </span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(systemData.riceData).map(([type, data]) => ({
                  name: type,
                  stock: data.totalStock || 0,
                  broken: data.totalBrokenRice || 0,
                  polish: data.totalPolishRice || 0,
                  sales: data.totalSales || 0
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
                  <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value.toLocaleString()} kg`, 'Quantity']}
                  />
                  <Legend />
                  <Bar dataKey="stock" name="Stock (kg)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="broken" name="Broken Rice (kg)" fill="#F97316" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="polish" name="Polish Rice (kg)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          )}
        </div>
      )}

      {/* Stock vs Sales Comparison Charts */}
      {systemData && (systemData.paddyData || systemData.riceData) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Paddy Stock vs Sales Pie Chart */}
          {systemData.paddyData && Object.keys(systemData.paddyData).length > 0 && (
            <GlassCard>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                <span className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Paddy Stock Distribution
                </span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(systemData.paddyData).map(([type, data]) => ({
                      name: type,
                      value: data.totalStock || 0
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {Object.keys(systemData.paddyData).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={[COLORS.green, COLORS.greenLight, COLORS.orange, COLORS.blue][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: '1px solid rgba(46, 125, 50, 0.3)',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value.toLocaleString()} kg`, 'Stock']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>
          )}

          {/* Rice Stock Distribution Pie Chart */}
          {systemData.riceData && Object.keys(systemData.riceData).length > 0 && (
            <GlassCard>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                <span className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  Rice Stock Distribution
                </span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(systemData.riceData).map(([type, data]) => ({
                      name: type,
                      value: data.totalStock || 0
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {Object.keys(systemData.riceData).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={[COLORS.purple, COLORS.purpleLight, COLORS.blue, COLORS.orange][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value.toLocaleString()} kg`, 'Stock']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>
          )}
        </div>
      )}

      {/* Revenue Analysis Charts */}
      {systemData && (systemData.paddyData || systemData.riceData) && (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <GlassCard>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Revenue by Product Type
              </span>
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={[
                ...Object.entries(systemData.paddyData || {}).map(([type, data]) => ({
                  name: `Paddy: ${type}`,
                  revenue: data.totalRevenue || 0,
                  quantity: data.totalSales || 0,
                  category: 'Paddy'
                })),
                ...Object.entries(systemData.riceData || {}).map(([type, data]) => ({
                  name: `Rice: ${type}`,
                  revenue: data.totalRevenue || 0,
                  quantity: data.totalSales || 0,
                  category: 'Rice'
                }))
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.2)" />
                <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={80} />
                <YAxis yAxisId="left" stroke={COLORS.green} label={{ value: 'Revenue (Rs.)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" stroke={COLORS.blue} label={{ value: 'Quantity (kg)', angle: 90, position: 'insideRight' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [
                    name === 'revenue' ? `Rs. ${value.toLocaleString()}` : `${value.toLocaleString()} kg`,
                    name === 'revenue' ? 'Revenue' : 'Quantity Sold'
                  ]}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue (Rs.)" fill={COLORS.green} radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="quantity" name="Quantity Sold (kg)" stroke={COLORS.blue} strokeWidth={3} dot={{ fill: COLORS.blue, r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      )}

      {/* Inventory Overview - Full Width Area Chart */}
      {systemData && systemData.summary && (
        <GlassCard>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            <span className="flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600" />
              Complete Inventory Overview
            </span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/30 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Paddy Types</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">{Object.keys(systemData.paddyData || {}).length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-500/10 dark:to-violet-500/10 border border-purple-200 dark:border-purple-500/30 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Rice Types</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{Object.keys(systemData.riceData || {}).length}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 border border-orange-200 dark:border-orange-500/30 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Threshing Records</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">{(systemData.threshingData || []).length}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-lg md:text-2xl font-bold text-blue-700 dark:text-blue-400">Rs. {((systemData.summary?.totalPaddySales || 0) + (systemData.summary?.totalRiceSales || 0)).toLocaleString()}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={[
              { name: 'Paddy Stock', value: systemData.summary?.totalPaddyStock || 0, fill: COLORS.green },
              { name: 'Rice Stock', value: systemData.summary?.totalRiceStock || 0, fill: COLORS.purple },
              { name: 'Broken Rice', value: systemData.summary?.totalBrokenRice || 0, fill: COLORS.orange },
              { name: 'Polish Rice', value: systemData.summary?.totalPolishRice || 0, fill: COLORS.blue }
            ]}>
              <defs>
                <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.green} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(46, 125, 50, 0.2)" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  border: '1px solid rgba(46, 125, 50, 0.3)',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value.toLocaleString()} kg`, 'Quantity']}
              />
              <Area type="monotone" dataKey="value" stroke={COLORS.green} fill="url(#colorGreen)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* Threshing Data Table */}
      {systemData && systemData.threshingData && systemData.threshingData.length > 0 && (
        <GlassCard>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Threshing Operations
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10">
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Paddy Type</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Paddy Qty</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Rice Type</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Rice Qty</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Broken Rice</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Polish Rice</th>
                </tr>
              </thead>
              <tbody>
                {systemData.threshingData.slice(0, 10).map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {item.date ? new Date(item.date).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-xs">
                        {item.paddyType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-medium">
                      {(item.paddyQuantity || item.PaddyQuantity || 0).toLocaleString()} kg
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded-full text-xs">
                        {item.riceType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-medium">
                      {(item.riceQuantity || 0).toLocaleString()} kg
                    </td>
                    <td className="py-3 px-4 text-right text-orange-600 dark:text-orange-400 font-medium">
                      {(item.brokenRiceQuantity || 0).toLocaleString()} kg
                    </td>
                    <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400 font-medium">
                      {(item.polishRiceQuantity || 0).toLocaleString()} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

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
