import { useState } from 'react';
import Modal from '../ui/Modal';
import NeonButton from '../ui/NeonButton';
import { ShoppingCart } from 'lucide-react';
import { RICE_TYPES, PADDY_TYPES } from '../../utils/constants';

const SaleModal = ({ isOpen, onClose, title, stockData, onSaleComplete }) => {
  const [formData, setFormData] = useState({
    riceType: '',
    paddyType: '',
    stockId: '',
    warehouse: '',
    customerName: '',
    customerId: '',
    customerPhone: '',
    bags: '',
    quantity: '',
    pricePerKg: '',
    totalAmount: 0,
    saleDate: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate total when quantity or price changes
      if (name === 'quantity' || name === 'pricePerKg') {
        const qty = parseFloat(updated.quantity) || 0;
        const price = parseFloat(updated.pricePerKg) || 0;
        updated.totalAmount = qty * price;
      }
      
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaleComplete(formData);
    setFormData({
      riceType: '',
      paddyType: '',
      stockId: '',
      warehouse: '',
      customerName: '',
      customerId: '',
      customerPhone: '',
      bags: '',
      quantity: '',
      pricePerKg: '',
      totalAmount: 0,
      saleDate: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  const selectedStock = stockData.find(stock => stock.id === formData.stockId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`New ${title} Sale`}>
      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        {title === 'Rice' && (
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rice Type
            </label>
            <select
              name="riceType"
              value={formData.riceType}
              onChange={handleInputChange}
              required
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
            >
              <option value="" className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">Select rice type...</option>
              {RICE_TYPES.map(type => (
                <option key={type} value={type} className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">{type}</option>
              ))}
            </select>
          </div>
        )}

        {title === 'Paddy' && (
          <>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Paddy Type
              </label>
              <select
                name="paddyType"
                value={formData.paddyType}
                onChange={handleInputChange}
                required
                className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
              >
                <option value="" className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">Select paddy type...</option>
                {PADDY_TYPES.map(type => (
                  <option key={type} value={type} className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Warehouse
              </label>
              <input
                type="text"
                name="warehouse"
                value={formData.warehouse}
                onChange={handleInputChange}
                required
                className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
                placeholder="Enter warehouse name"
              />
            </div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Customer Name
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Customer ID
            </label>
            <input
              type="text"
              name="customerId"
              value={formData.customerId}
              onChange={handleInputChange}
              required
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Enter customer ID"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              required
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bags
            </label>
            <input
              type="number"
              name="bags"
              value={formData.bags}
              onChange={handleInputChange}
              required
              min="0"
              step="1"
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Number of bags"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity (kg)
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              min="0.1"
              step="0.1"
              max={selectedStock?.quantity || 999999}
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Enter quantity"
            />
            {selectedStock && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Available: {selectedStock.quantity} {selectedStock.unit}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price per kg (Rs.)
            </label>
            <input
              type="number"
              name="pricePerKg"
              value={formData.pricePerKg}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Price per kg"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sale Date
          </label>
          <input
            type="date"
            name="saleDate"
            value={formData.saleDate}
            onChange={handleInputChange}
            required
            className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
          />
        </div>

        <div className="bg-[#2E7D32]/10 border border-[#2E7D32]/20 dark:bg-primary-500/10 dark:border-primary-500/20 rounded-lg p-3 md:p-4">
          <div className="flex justify-between items-center">
            <span className="text-[#2E7D32] dark:text-primary-400 font-medium text-sm md:text-base">Total Amount:</span>
            <span className="text-[#2E7D32] dark:text-primary-400 text-lg md:text-xl font-bold">
              Rs. {formData.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 pt-4">
          <NeonButton type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </NeonButton>
          <NeonButton type="submit" className="w-full sm:w-auto">
            <ShoppingCart size={20} />
            Complete Sale
          </NeonButton>
        </div>
      </form>
    </Modal>
  );
};

export default SaleModal;