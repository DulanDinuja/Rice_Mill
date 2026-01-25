import { useState, useEffect } from 'react';
import { Plus, Search, Download, ShoppingCart } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import HolographicBadge from '../components/ui/HolographicBadge';
import AddPaddyStockModal from '../components/modals/AddPaddyStockModal';
import ExportModal from '../components/modals/ExportModal';
import SaleModal from '../components/modals/SaleModal';
import { stockService } from '../services/api/stockService';
import { exportService } from '../services/exportService';
import { salesService } from '../services/salesService';
import { formatDate, formatCurrency } from '../utils/formatters';

const PaddyStock = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      const response = await stockService.getPaddyStocks();
      setStocks(response.data);
    } catch (error) {
      console.error('Failed to load stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockAdded = (newStock) => {
    setStocks(prevStocks => [...prevStocks, newStock]);
  };

  const handleExport = async (options) => {
    try {
      await exportService.exportPaddyStock(options);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleSaleComplete = async (saleData) => {
    try {
      await salesService.createPaddySale(saleData);
      await salesService.updateStockAfterSale(saleData.stockId, saleData.quantity, 'paddy');
      loadStocks();
    } catch (error) {
      console.error('Sale failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-gaming font-bold text-gray-900 dark:text-white mb-2">Paddy Stock</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your paddy inventory</p>
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
          <NeonButton onClick={() => setIsModalOpen(true)} className="font-black">
            <Plus size={20} />
            Add Stock
          </NeonButton>
        </div>
      </div>

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#66BB6A]/20 dark:border-secondary-500/20">
                <th className="text-left py-3 px-4 text-[#66BB6A] dark:text-secondary-400 font-medium">Paddy Type</th>
                <th className="text-left py-3 px-4 text-[#66BB6A] dark:text-secondary-400 font-medium">Quantity</th>
                <th className="text-left py-3 px-4 text-[#66BB6A] dark:text-secondary-400 font-medium">Warehouse</th>
                <th className="text-left py-3 px-4 text-[#66BB6A] dark:text-secondary-400 font-medium">Moisture %</th>
                <th className="text-left py-3 px-4 text-[#66BB6A] dark:text-secondary-400 font-medium">Supplier</th>
                <th className="text-left py-3 px-4 text-[#66BB6A] dark:text-secondary-400 font-medium">Price/kg</th>
                <th className="text-left py-3 px-4 text-[#66BB6A] dark:text-secondary-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">{stock.paddyType}</td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{stock.quantity} {stock.unit}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{stock.warehouse}</td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{stock.moistureLevel}%</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{stock.supplier}</td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{formatCurrency(stock.pricePerKg)}</td>
                  <td className="py-4 px-4">
                    <HolographicBadge status="success">{stock.status}</HolographicBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <AddPaddyStockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStockAdded={handleStockAdded}
      />
      
      <SaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        title="Paddy"
        stockData={stocks}
        onSaleComplete={handleSaleComplete}
      />
      
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Paddy Stock"
        onExport={handleExport}
      />
    </div>
  );
};

export default PaddyStock;
