import { useState } from 'react';
import Modal from '../ui/Modal';
import NeonButton from '../ui/NeonButton';
import { ShoppingCart, User, Calendar } from 'lucide-react';

const SaleModal = ({ isOpen, onClose, title, stockData, onSaleComplete }) => {
  const [formData, setFormData] = useState({
    stockId: '',
    customerName: '',
    customerPhone: '',
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
      
      // Auto-fill price when stock is selected
      if (name === 'stockId') {
        const selectedStock = stockData.find(stock => stock.id === value);
        if (selectedStock) {
          updated.pricePerKg = selectedStock.pricePerKg;
          const qty = parseFloat(updated.quantity) || 0;
          updated.totalAmount = qty * selectedStock.pricePerKg;
        }
      }
      
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaleComplete(formData);
    setFormData({
      stockId: '',
      customerName: '',
      customerPhone: '',
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select {title}
          </label>
          <select
            name="stockId"
            value={formData.stockId}
            onChange={handleInputChange}
            required
            className="w-full glass-input rounded-lg px-3 py-2"
          >
            <option value="">Choose {title.toLowerCase()}...</option>
            {stockData.map(stock => (
              <option key={stock.id} value={stock.id}>
                {title === 'Rice' ? stock.riceType : stock.paddyType} - {stock.quantity} {stock.unit} (Rs. {stock.pricePerKg}/kg)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Customer Name
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
              className="w-full glass-input rounded-lg px-3 py-2"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              className="w-full glass-input rounded-lg px-3 py-2"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
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
              className="w-full glass-input rounded-lg px-3 py-2"
              placeholder="Enter quantity"
            />
            {selectedStock && (
              <p className="text-xs text-gray-400 mt-1">
                Available: {selectedStock.quantity} {selectedStock.unit}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
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
              className="w-full glass-input rounded-lg px-3 py-2"
              placeholder="Price per kg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Sale Date
          </label>
          <input
            type="date"
            name="saleDate"
            value={formData.saleDate}
            onChange={handleInputChange}
            required
            className="w-full glass-input rounded-lg px-3 py-2"
          />
        </div>

        <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-primary-400 font-medium">Total Amount:</span>
            <span className="text-white text-xl font-bold">
              Rs. {formData.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <NeonButton type="button" variant="outline" onClick={onClose}>
            Cancel
          </NeonButton>
          <NeonButton type="submit">
            <ShoppingCart size={20} />
            Complete Sale
          </NeonButton>
        </div>
      </form>
    </Modal>
  );
};

export default SaleModal;