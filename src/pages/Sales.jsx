import { useState, useEffect } from 'react';
import { Search, Filter, Download, TrendingUp } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import HolographicBadge from '../components/ui/HolographicBadge';
import IOSStatsCard from '../components/ui/IOSStatsCard';
import { salesService } from '../services/salesService';
import { formatDate, formatCurrency } from '../utils/formatters';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    loadSales();
  }, []);

  useEffect(() => {
    filterSales();
  }, [sales, searchTerm, filterType, dateFilter]);

  const loadSales = async () => {
    try {
      const response = await salesService.getAllSales();
      setSales(response.data);
    } catch (error) {
      console.error('Failed to load sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSales = () => {
    let filtered = sales;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(sale => sale.type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(sale =>
        sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customerPhone.includes(searchTerm) ||
        (sale.type === 'rice' ? 
          sales.find(s => s.stockId === sale.stockId)?.riceType?.toLowerCase().includes(searchTerm.toLowerCase()) :
          sales.find(s => s.stockId === sale.stockId)?.paddyType?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(sale => new Date(sale.saleDate) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(sale => new Date(sale.saleDate) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(sale => new Date(sale.saleDate) >= filterDate);
          break;
      }
    }

    setFilteredSales(filtered);
  };

  const calculateStats = () => {
    const totalSales = filteredSales.length;
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const riceSales = filteredSales.filter(sale => sale.type === 'rice').length;
    const paddySales = filteredSales.filter(sale => sale.type === 'paddy').length;

    return { totalSales, totalRevenue, riceSales, paddySales };
  };

  const stats = calculateStats();

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Type', 'Customer', 'Phone', 'Quantity', 'Price/kg', 'Total Amount'],
      ...filteredSales.map(sale => [
        formatDate(sale.saleDate),
        sale.type,
        sale.customerName,
        sale.customerPhone,
        sale.quantity,
        sale.pricePerKg,
        sale.totalAmount
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-cyber-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-gaming font-bold text-white mb-2">Sales Management</h1>
          <p className="text-gray-400">Track and manage all rice and paddy sales</p>
        </div>
        <NeonButton variant="outline" onClick={handleExport}>
          <Download size={20} />
          Export Sales
        </NeonButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <IOSStatsCard
          title="Total Sales"
          value={stats.totalSales}
          icon={TrendingUp}
          trend="+12%"
          color="primary"
        />
        <IOSStatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={TrendingUp}
          trend="+8%"
          color="success"
        />
        <IOSStatsCard
          title="Rice Sales"
          value={stats.riceSales}
          icon={TrendingUp}
          trend="+15%"
          color="info"
        />
        <IOSStatsCard
          title="Paddy Sales"
          value={stats.paddySales}
          icon={TrendingUp}
          trend="+5%"
          color="warning"
        />
      </div>

      {/* Filters */}
      <GlassCard>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search customer, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass-input rounded-lg pl-11 pr-4 py-3"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="glass-input rounded-lg px-3 py-3"
          >
            <option value="all">All Types</option>
            <option value="rice">Rice Only</option>
            <option value="paddy">Paddy Only</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="glass-input rounded-lg px-3 py-3"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>

          <div className="flex items-center text-gray-400">
            <Filter size={20} className="mr-2" />
            {filteredSales.length} of {sales.length} sales
          </div>
        </div>
      </GlassCard>

      {/* Sales Table */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-500/20">
                <th className="text-left py-3 px-4 text-primary-400 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-primary-400 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-primary-400 font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-primary-400 font-medium">Phone</th>
                <th className="text-left py-3 px-4 text-primary-400 font-medium">Quantity</th>
                <th className="text-left py-3 px-4 text-primary-400 font-medium">Price/kg</th>
                <th className="text-left py-3 px-4 text-primary-400 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-white">{formatDate(sale.saleDate)}</td>
                  <td className="py-4 px-4">
                    <HolographicBadge 
                      status={sale.type === 'rice' ? 'info' : 'warning'}
                      size="sm"
                    >
                      {sale.type.toUpperCase()}
                    </HolographicBadge>
                  </td>
                  <td className="py-4 px-4 text-white font-medium">{sale.customerName}</td>
                  <td className="py-4 px-4 text-gray-400">{sale.customerPhone}</td>
                  <td className="py-4 px-4 text-white">{sale.quantity} kg</td>
                  <td className="py-4 px-4 text-white">{formatCurrency(sale.pricePerKg)}</td>
                  <td className="py-4 px-4 text-primary-400 font-bold">
                    {formatCurrency(sale.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredSales.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No sales found</p>
              <p className="text-gray-500 text-sm mt-2">
                {sales.length === 0 ? 'No sales recorded yet' : 'Try adjusting your filters'}
              </p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default Sales;