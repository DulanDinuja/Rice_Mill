import { useState, useEffect } from 'react';
import { Plus, Search, Download, ShoppingCart } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import HolographicBadge from '../components/ui/HolographicBadge';
import AddStockModal from '../components/modals/AddStockModal';
import ExportModal from '../components/modals/ExportModal';
import SaleModal from '../components/modals/SaleModal';
import { stockService } from '../services/api/stockService';
import { exportService } from '../services/exportService';
import { salesService } from '../services/salesService';
import { formatDate, formatCurrency } from '../utils/formatters';

const RiceStock = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      const response = await stockService.getRiceStocks();
      setStocks(response.data);
    } catch (error) {
      console.error('Failed to load stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStocks = stocks.filter(stock =>
    stock.riceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusMap = {
      'In Stock': 'success',
      'Low Stock': 'warning',
      'Out of Stock': 'danger'
    };
    return statusMap[status] || 'default';
  };

  const handleStockAdded = (newStock) => {
    setStocks(prev => [...prev, newStock]);
  };

  const handleExport = async (options) => {
    try {
      await exportService.exportRiceStock(options);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleSaleComplete = async (saleData) => {
    try {
      await salesService.createRiceSale(saleData);
      await salesService.updateStockAfterSale(saleData.stockId, saleData.quantity, 'rice');
      loadStocks();
    } catch (error) {
      console.error('Sale failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-gaming font-bold text-white mb-2">Rice Stock</h1>
          <p className="text-gray-400">Manage your rice inventory</p>
        </div>
        <div className="flex gap-3">
          <NeonButton variant="outline" onClick={() => setIsSaleModalOpen(true)}>
            <ShoppingCart size={20} />
            New Sale
          </NeonButton>
          <NeonButton variant="outline" onClick={() => setIsExportModalOpen(true)}>
            <Download size={20} />
            Export
          </NeonButton>
          <NeonButton onClick={() => setIsAddModalOpen(true)} className="font-black">
            <Plus size={20} />
            Add Stock
          </NeonButton>
        </div>
      </div>

      <GlassCard>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search rice type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass-input rounded-lg pl-11 pr-4 py-3"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-500/20">
                <th className="text-left py-3 px-4 text-primary-400 font-medium">Rice Type</th>
                <th className="text-left py-3 px-4 text-primary-400 font-medium">Quantity</th>
                <th className="text-left py-3 px-4 text-primary-400 font-medium">Warehouse</th>
                <th className="text-left py-3 px-4 text-primary-400 font-medium">Grade</th>
                <th className="text-left py-3 px-4 text-primary-400 font-medium">Price/kg</th>
                <th className="text-left py-3 px-4 text-primary-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-primary-400 font-medium">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock) => (
                <tr key={stock.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-white font-medium">{stock.riceType}</td>
                  <td className="py-4 px-4 text-white">{stock.quantity} {stock.unit}</td>
                  <td className="py-4 px-4 text-gray-400">{stock.warehouse}</td>
                  <td className="py-4 px-4">
                    <HolographicBadge status="info" size="sm">{stock.grade}</HolographicBadge>
                  </td>
                  <td className="py-4 px-4 text-white">{formatCurrency(stock.pricePerKg)}</td>
                  <td className="py-4 px-4">
                    <HolographicBadge status={getStatusBadge(stock.status)}>
                      {stock.status}
                    </HolographicBadge>
                  </td>
                  <td className="py-4 px-4 text-gray-400">{formatDate(stock.lastUpdated)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStockAdded={handleStockAdded}
      />
      
      <SaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        title="Rice"
        stockData={stocks}
        onSaleComplete={handleSaleComplete}
      />
      
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Rice Stock"
        onExport={handleExport}
      />
    </div>
  );
};

export default RiceStock;
