import { useState, useEffect } from 'react';
import { Plus, Download, ShoppingCart, Wheat, Edit, Trash2 } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import HolographicBadge from '../components/ui/HolographicBadge';
import AddPaddyStockModal from '../components/modals/AddPaddyStockModal';
import ExportModal from '../components/modals/ExportModal';
import SaleModal from '../components/modals/SaleModal';
import ThreshingModal from '../components/modals/ThreshingModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import { stockService } from '../services/api/stockService';
import { exportService } from '../services/exportService';
import { salesService } from '../services/salesService';
import { formatCurrency, formatDate } from '../utils/formatters';

const PaddyStock = () => {
  const [stocks, setStocks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isThreshingModalOpen, setIsThreshingModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      const response = await stockService.getPaddyStocks();
      setStocks(response.data);
    } catch (error) {
      console.error('Failed to load stocks:', error);
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

  const handleThreshingComplete = async (threshingData) => {
    try {
      // Update paddy stock (reduce quantity)
      await salesService.updateStockAfterSale(
        threshingData.paddyStockId,
        threshingData.paddyQuantity,
        'paddy'
      );

      // Add rice stock
      await stockService.addRiceStock({
        riceType: threshingData.riceType,
        quantity: threshingData.riceQuantity,
        unit: 'kg',
        warehouse: threshingData.warehouse,
        grade: threshingData.riceGrade,
        pricePerKg: 0, // Price can be set later
        status: 'In Stock'
      });

      // Reload stocks
      loadStocks();

      console.log('Threshing completed:', threshingData);
    } catch (error) {
      console.error('Threshing failed:', error);
    }
  };

  const getMobileStatusText = (status) => {
    const mobileTextMap = {
      'In Stock': 'In',
      'Low Stock': 'Low',
      'Out of Stock': 'Out'
    };
    return mobileTextMap[status] || status;
  };

  const handleEdit = (stock) => {
    setSelectedStock(stock);
    setIsEditModalOpen(true);
  };

  const handleStockUpdated = (updatedStock) => {
    setStocks(prev => prev.map(stock =>
      stock.id === updatedStock.id ? updatedStock : stock
    ));
  };

  const handleDelete = (stock) => {
    setStockToDelete(stock);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async (reason) => {
    if (stockToDelete) {
      try {
        await stockService.deletePaddyStock(stockToDelete.id);
        setStocks(prev => prev.filter(stock => stock.id !== stockToDelete.id));
        console.log('Stock deleted. Reason:', reason); // Log the reason
        setIsDeleteModalOpen(false);
        setStockToDelete(null);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-gaming font-bold text-gray-900 dark:text-white mb-1 md:mb-2">Paddy Stock</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Manage your paddy inventory</p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <NeonButton variant="outline" onClick={() => setIsThreshingModalOpen(true)} className="flex-1 sm:flex-none">
            <Wheat size={20} />
            <span className="hidden sm:inline">Threshing</span>
          </NeonButton>
          <NeonButton variant="outline" onClick={() => setIsSaleModalOpen(true)} className="flex-1 sm:flex-none">
            <ShoppingCart size={20} />
            <span className="hidden sm:inline">New Sale</span>
          </NeonButton>
          <NeonButton variant="outline" onClick={() => setIsExportModalOpen(true)} className="flex-1 sm:flex-none">
            <Download size={20} />
            <span className="hidden sm:inline">Export</span>
          </NeonButton>
          <NeonButton onClick={() => setIsModalOpen(true)} className="font-black flex-1 sm:flex-none">
            <Plus size={20} />
            <span className="hidden sm:inline">Add Stock</span>
          </NeonButton>
        </div>
      </div>

      <GlassCard className="overflow-hidden">
        {/* Mobile: Show scroll hint */}
        <div className="block md:hidden px-4 pt-4 pb-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">← Scroll horizontally to view all columns →</p>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-white/5">
              <thead>
                <tr className="border-b border-[#66BB6A]/20 dark:border-secondary-500/20 bg-gray-50 dark:bg-white/[0.02]">
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#66BB6A] dark:text-secondary-400 font-medium text-xs md:text-sm whitespace-nowrap">Paddy Type</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#66BB6A] dark:text-secondary-400 font-medium text-xs md:text-sm whitespace-nowrap">Quantity</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#66BB6A] dark:text-secondary-400 font-medium text-xs md:text-sm whitespace-nowrap">Warehouse</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#66BB6A] dark:text-secondary-400 font-medium text-xs md:text-sm whitespace-nowrap">Moisture %</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#66BB6A] dark:text-secondary-400 font-medium text-xs md:text-sm whitespace-nowrap">Price/kg</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#66BB6A] dark:text-secondary-400 font-medium text-xs md:text-sm whitespace-nowrap">Supplier Name</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#66BB6A] dark:text-secondary-400 font-medium text-xs md:text-sm whitespace-nowrap">Contact</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#66BB6A] dark:text-secondary-400 font-medium text-xs md:text-sm whitespace-nowrap">Status</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#66BB6A] dark:text-secondary-400 font-medium text-xs md:text-sm whitespace-nowrap">Last Updated</th>
                  <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#66BB6A] dark:text-secondary-400 font-medium text-xs md:text-sm whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-transparent divide-y divide-gray-100 dark:divide-white/5">
                {stocks.map((stock) => (
                  <tr key={stock.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 md:py-4 px-2 md:px-4 text-gray-900 dark:text-white font-medium text-xs md:text-sm whitespace-nowrap">{stock.paddyType}</td>
                    <td className="py-3 md:py-4 px-2 md:px-4 text-gray-900 dark:text-white text-xs md:text-sm whitespace-nowrap">{stock.quantity} {stock.unit}</td>
                    <td className="py-3 md:py-4 px-2 md:px-4 text-gray-600 dark:text-gray-400 text-xs md:text-sm whitespace-nowrap">{stock.warehouse}</td>
                    <td className="py-3 md:py-4 px-2 md:px-4 text-gray-900 dark:text-white text-xs md:text-sm whitespace-nowrap">{stock.moistureLevel}%</td>
                    <td className="py-3 md:py-4 px-2 md:px-4 text-gray-900 dark:text-white text-xs md:text-sm whitespace-nowrap">{formatCurrency(stock.pricePerKg)}</td>
                    <td className="py-3 md:py-4 px-2 md:px-4 text-gray-600 dark:text-gray-400 text-xs md:text-sm whitespace-nowrap">{stock.customerName || '-'}</td>
                    <td className="py-3 md:py-4 px-2 md:px-4 text-gray-600 dark:text-gray-400 text-xs md:text-sm whitespace-nowrap">{stock.mobileNumber || '-'}</td>
                    <td className="py-3 md:py-4 px-2 md:px-4">
                      <HolographicBadge status="success" size="xs" className="md:!px-3 md:!py-1.5 md:!text-sm">
                        <span className="md:hidden">{getMobileStatusText(stock.status)}</span>
                        <span className="hidden md:inline">{stock.status}</span>
                      </HolographicBadge>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-4 text-gray-600 dark:text-gray-400 text-xs md:text-sm whitespace-nowrap">{formatDate(stock.lastUpdated)}</td>
                    <td className="py-3 md:py-4 px-2 md:px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(stock)}
                          className="p-1.5 md:p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(stock)}
                          className="p-1.5 md:p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>

      <AddPaddyStockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStockAdded={handleStockAdded}
      />

      {selectedStock && (
        <AddPaddyStockModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedStock(null);
          }}
          onStockAdded={handleStockUpdated}
          editMode={true}
          initialData={selectedStock}
        />
      )}

      <ThreshingModal
        isOpen={isThreshingModalOpen}
        onClose={() => setIsThreshingModalOpen(false)}
        paddyStocks={stocks}
        onThreshingComplete={handleThreshingComplete}
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

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setStockToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName={stockToDelete ? `${stockToDelete.paddyType} (${stockToDelete.quantity} ${stockToDelete.unit})` : ''}
      />
    </div>
  );
};

export default PaddyStock;
