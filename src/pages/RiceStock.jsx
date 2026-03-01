import { useState, useEffect } from 'react';
import { Plus, Search, Download, ShoppingCart, Edit, Trash2, ArrowUp, ArrowDown, Wheat } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import HolographicBadge from '../components/ui/HolographicBadge';
import AddStockModal from '../components/modals/AddStockModal';
import ExportModal from '../components/modals/ExportModal';
import SaleModal from '../components/modals/SaleModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import { stockService } from '../services/api/stockService';
import { exportService } from '../services/exportService';
import { salesService } from '../services/salesService';
import { formatDate, formatCurrency } from '../utils/formatters';

const RiceStock = () => {
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      const response = await stockService.getRiceStocks();
      setStocks(response.data);
    } catch (error) {
      console.error('Failed to load stocks:', error);
    }
  };

  const filteredStocks = stocks.filter(stock => {
    const search = searchTerm.toLowerCase();
    return (
      stock.riceType?.toLowerCase().includes(search) ||
      stock.quantity?.toString().includes(search) ||
      stock.pricePerKg?.toString().includes(search) ||
      stock.customerName?.toLowerCase().includes(search) ||
      stock.customerId?.toLowerCase().includes(search) ||
      stock.mobileNumber?.toLowerCase().includes(search) ||
      stock.status?.toLowerCase().includes(search) ||
      formatDate(stock.lastUpdated)?.toLowerCase().includes(search) ||
      stock.bags?.toString().includes(search)
    );
  }).sort((a, b) => {
    const dateA = new Date(a.lastUpdated);
    const dateB = new Date(b.lastUpdated);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const getStatusBadge = (status) => {
    const statusMap = {
      'In Stock': 'success',
      'Low Stock': 'warning',
      'Out of Stock': 'danger'
    };
    return statusMap[status] || 'default';
  };

  const getMobileStatusText = (status) => {
    const mobileTextMap = {
      'In Stock': 'In',
      'Low Stock': 'Low',
      'Out of Stock': 'Out'
    };
    return mobileTextMap[status] || status;
  };

  const handleStockAdded = (newStock) => {
    loadStocks();
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
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const payload = {
        riceType: saleData.riceType,
        quantity: parseInt(saleData.quantity),
        pricePerKg: parseFloat(saleData.pricePerKg),
        customerName: saleData.customerName,
        customerId: saleData.customerId,
        mobileNumber: saleData.customerPhone,
        bags: parseInt(saleData.bags) || 0,
        status: 'sale',
        totalamount: parseFloat(saleData.totalAmount),
        date: saleData.saleDate,
        user: user.username || user.name || ''
      };
      await stockService.addRiceSale(payload);
      loadStocks();
    } catch (error) {
      console.error('Sale failed:', error);
    }
  };

  const handleEdit = (stock) => {
    setSelectedStock(stock);
    setIsEditModalOpen(true);
  };

  const handleStockUpdated = (updatedStock) => {
    loadStocks(); // Reload all stocks to get fresh data
  };

  const handleDelete = (stock) => {
    setStockToDelete(stock);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async (reason) => {
    if (stockToDelete) {
      try {
        const transactionType = stockToDelete.transactionType;
        if (transactionType === 'Sale') {
          await stockService.deleteRiceSale(stockToDelete.id, reason);
        } else if (transactionType === 'Threshing') {
          await stockService.deletePaddyThreshing(stockToDelete.id, reason);
        } else {
          await stockService.deleteRiceStock(stockToDelete.id, reason);
        }
        loadStocks();
        console.log('Stock deleted. Reason:', reason);
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
          <h1 className="text-2xl md:text-3xl font-gaming font-bold text-gray-900 dark:text-white mb-1 md:mb-2">Rice Stock</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Manage your rice inventory</p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <NeonButton variant="outline" onClick={() => setIsSaleModalOpen(true)} className="flex-1 sm:flex-none">
            <ShoppingCart size={20} />
            <span className="hidden sm:inline">Rice Sale</span>
          </NeonButton>
          <NeonButton variant="outline" onClick={() => setIsExportModalOpen(true)} className="flex-1 sm:flex-none">
            <Download size={20} />
            <span className="hidden sm:inline">Export</span>
          </NeonButton>
          <NeonButton onClick={() => setIsAddModalOpen(true)} className="font-black flex-1 sm:flex-none">
            <Plus size={20} />
            <span className="hidden sm:inline">Add Stock</span>
          </NeonButton>
        </div>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="mb-4 md:mb-6 px-4 md:px-6 pt-4 md:pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by rice type, quantity, date, customer, or any field..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass-input rounded-lg pl-11 pr-4 py-2 md:py-3 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
            />
          </div>
        </div>

        {/* Mobile: Show scroll hint */}
        <div className="block md:hidden px-4 pb-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">← Scroll horizontally to view all columns →</p>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-white/5">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-[#2E7D32]/20 dark:border-primary-500/20 bg-gray-50 dark:bg-white/[0.02]">
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#2E7D32] dark:text-primary-400 font-medium text-xs md:text-sm whitespace-nowrap w-[13%]">Rice Type</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#2E7D32] dark:text-primary-400 font-medium text-xs md:text-sm whitespace-nowrap w-[12%]">Quantity (kg)</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#2E7D32] dark:text-primary-400 font-medium text-xs md:text-sm whitespace-nowrap w-[12%]">Price/kg</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#2E7D32] dark:text-primary-400 font-medium text-xs md:text-sm whitespace-nowrap w-[15%]">Customer</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#2E7D32] dark:text-primary-400 font-medium text-xs md:text-sm whitespace-nowrap w-[13%]">Contact</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#2E7D32] dark:text-primary-400 font-medium text-xs md:text-sm whitespace-nowrap w-[12%]">Status</th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#2E7D32] dark:text-primary-400 font-medium text-xs md:text-sm whitespace-nowrap w-[13%]">
                      <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                        Last Updated
                        {sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      </button>
                    </th>
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#2E7D32] dark:text-primary-400 font-medium text-xs md:text-sm whitespace-nowrap w-[10%]">Actions</th>
                  </tr>
                </thead>
              </table>
              <div className="overflow-y-auto max-h-[500px]">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-white/5">
                  <thead className="invisible">
                    <tr>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#2E7D32] dark:text-primary-400 font-medium text-xs md:text-sm whitespace-nowrap w-[13%]">Rice Type</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#2E7D32] dark:text-primary-400 font-medium text-xs md:text-sm whitespace-nowrap w-[12%]">Quantity (kg)</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#2E7D32] dark:text-primary-400 font-medium text-xs md:text-sm whitespace-nowrap w-[12%]">Price/kg</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#2E7D32] dark:text-primary-400 font-medium text-xs md:text-sm whitespace-nowrap w-[15%]">Customer</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#2E7D32] dark:text-primary-400 font-medium text-xs md:text-sm whitespace-nowrap w-[13%]">Contact</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#2E7D32] dark:text-primary-400 font-medium text-xs md:text-sm whitespace-nowrap w-[12%]">Type</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#2E7D32] dark:text-primary-400 font-medium text-xs md:text-sm whitespace-nowrap w-[13%]">Last Updated</th>
                      <th className="text-left py-2 md:py-3 px-2 md:px-4 text-[#2E7D32] dark:text-primary-400 font-medium text-xs md:text-sm whitespace-nowrap w-[10%]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-transparent divide-y divide-gray-100 dark:divide-white/5">
                    {filteredStocks.map((stock) => (
                      <tr key={stock.uniqueId || stock.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 md:py-4 px-2 md:px-4 text-gray-900 dark:text-white font-medium text-xs md:text-sm whitespace-nowrap w-[13%]">{stock.riceType}</td>
                        <td className="py-3 md:py-4 px-2 md:px-4 text-gray-900 dark:text-white text-xs md:text-sm whitespace-nowrap w-[12%]">{stock.quantity} kg</td>
                        <td className="py-3 md:py-4 px-2 md:px-4 text-gray-900 dark:text-white text-xs md:text-sm whitespace-nowrap w-[12%]">
                          {stock.transactionType === 'Threshing' ? (
                            <Wheat size={16} className="text-[#66BB6A]" />
                          ) : (
                            formatCurrency(stock.pricePerKg)
                          )}
                        </td>
                        <td className="py-3 md:py-4 px-2 md:px-4 text-gray-600 dark:text-gray-400 text-xs md:text-sm whitespace-nowrap w-[15%]">
                          {stock.transactionType === 'Threshing' ? (
                            <Wheat size={16} className="text-[#66BB6A]" />
                          ) : (
                            stock.customerName || '-'
                          )}
                        </td>
                        <td className="py-3 md:py-4 px-2 md:px-4 text-gray-600 dark:text-gray-400 text-xs md:text-sm whitespace-nowrap w-[13%]">
                          {stock.transactionType === 'Threshing' ? (
                            <Wheat size={16} className="text-[#66BB6A]" />
                          ) : (
                            stock.mobileNumber || '-'
                          )}
                        </td>
                        <td className="py-3 md:py-4 px-2 md:px-4 w-[12%]">
                          <HolographicBadge 
                            status={(stock.status === 'U-addstock' || stock.status === 'U-sale' || stock.status === 'U-threshing') ? 'warning' : (stock.transactionType === 'Threshing' ? 'purple' : (stock.transactionType === 'Sale' ? 'info' : 'success'))} 
                            size="xs" 
                            className="!px-2 !py-1 !text-xs"
                          >
                            {stock.transactionType === 'Threshing' ? 'Add Stock' : (stock.transactionType || 'Add Stock')}
                          </HolographicBadge>
                        </td>
                        <td className="py-3 md:py-4 px-2 md:px-4 text-gray-600 dark:text-gray-400 text-xs md:text-sm whitespace-nowrap w-[13%]">{formatDate(stock.lastUpdated)}</td>
                        <td className="py-3 md:py-4 px-2 md:px-4 w-[10%]">
                          <div className="flex gap-2">
                            {/* Hide Edit button for Threshing records (purple status) */}
                            {stock.transactionType !== 'Threshing' && (
                              <button
                                onClick={() => handleEdit(stock)}
                                className="p-1.5 md:p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                            )}
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
          </div>
        </div>
      </GlassCard>

      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStockAdded={handleStockAdded}
      />

      {selectedStock && (
        <AddStockModal
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

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setStockToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName={stockToDelete ? `${stockToDelete.riceType} (${stockToDelete.quantity} kg)` : ''}
      />
    </div>
  );
};

export default RiceStock;
