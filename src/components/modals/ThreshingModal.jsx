import { useState } from 'react';
import Modal from '../ui/Modal';
import NeonButton from '../ui/NeonButton';
import { Wheat } from 'lucide-react';

const ThreshingModal = ({ isOpen, onClose, paddyStocks, onThreshingComplete }) => {
  const [formData, setFormData] = useState({
    paddyStockId: '',
    paddyQuantity: '',
    riceType: '',
    riceQuantity: '',
    riceGrade: 'A',
    conversionRate: 65, // Default 65% conversion rate
    brokenRiceQuantity: '',
    huskQuantity: '',
    warehouse: '',
    threshingDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };

      // Auto-calculate rice quantity based on conversion rate
      if (name === 'paddyQuantity' || name === 'conversionRate') {
        const paddyQty = parseFloat(updated.paddyQuantity) || 0;
        const rate = parseFloat(updated.conversionRate) || 0;
        updated.riceQuantity = (paddyQty * rate / 100).toFixed(2);
        updated.brokenRiceQuantity = (paddyQty * 0.05).toFixed(2); // 5% broken rice
        updated.huskQuantity = (paddyQty - updated.riceQuantity - updated.brokenRiceQuantity).toFixed(2);
      }

      // Auto-fill warehouse when paddy stock is selected
      if (name === 'paddyStockId') {
        const selectedStock = paddyStocks.find(stock => stock.id === value);
        if (selectedStock) {
          updated.warehouse = selectedStock.warehouse;
        }
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onThreshingComplete(formData);
    setFormData({
      paddyStockId: '',
      paddyQuantity: '',
      riceType: '',
      riceQuantity: '',
      riceGrade: 'A',
      conversionRate: 65,
      brokenRiceQuantity: '',
      huskQuantity: '',
      warehouse: '',
      threshingDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    onClose();
  };

  const selectedStock = paddyStocks.find(stock => stock.id === formData.paddyStockId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Threshing Paddy">
      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        {/* Paddy Selection */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Paddy Stock
          </label>
          <select
            name="paddyStockId"
            value={formData.paddyStockId}
            onChange={handleInputChange}
            required
            className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
          >
            <option value="" className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">Choose paddy stock...</option>
            {paddyStocks.map(stock => (
              <option key={stock.id} value={stock.id} className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">
                {stock.paddyType} - {stock.quantity} {stock.unit} ({stock.warehouse})
              </option>
            ))}
          </select>
        </div>

        {/* Paddy Quantity & Conversion Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Paddy Quantity (kg)
            </label>
            <input
              type="number"
              name="paddyQuantity"
              value={formData.paddyQuantity}
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
              Conversion Rate (%)
            </label>
            <input
              type="number"
              name="conversionRate"
              value={formData.conversionRate}
              onChange={handleInputChange}
              required
              min="50"
              max="80"
              step="0.1"
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Conversion rate"
            />
          </div>
        </div>

        {/* Rice Type & Grade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rice Type
            </label>
            <input
              type="text"
              name="riceType"
              value={formData.riceType}
              onChange={handleInputChange}
              required
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Enter rice type"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rice Grade
            </label>
            <select
              name="riceGrade"
              value={formData.riceGrade}
              onChange={handleInputChange}
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
            >
              <option value="A" className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">Grade A</option>
              <option value="B" className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">Grade B</option>
              <option value="C" className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">Grade C</option>
            </select>
          </div>
        </div>

        {/* Rice Quantity & Broken Rice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rice Quantity (kg)
            </label>
            <input
              type="number"
              name="riceQuantity"
              value={formData.riceQuantity}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Auto-calculated"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Broken Rice (kg)
            </label>
            <input
              type="number"
              name="brokenRiceQuantity"
              value={formData.brokenRiceQuantity}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Auto-calculated"
            />
          </div>
        </div>

        {/* Husk Quantity & Warehouse */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Husk Quantity (kg)
            </label>
            <input
              type="number"
              name="huskQuantity"
              value={formData.huskQuantity}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Auto-calculated"
            />
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
              placeholder="Warehouse location"
            />
          </div>
        </div>

        {/* Threshing Date */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Threshing Date
          </label>
          <input
            type="date"
            name="threshingDate"
            value={formData.threshingDate}
            onChange={handleInputChange}
            required
            className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
            className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
            placeholder="Add any notes about the threshing process..."
          />
        </div>

        {/* Summary Box */}
        {formData.paddyQuantity && (
          <div className="bg-[#2E7D32]/10 border border-[#2E7D32]/20 dark:bg-primary-500/10 dark:border-primary-500/20 rounded-lg p-3 md:p-4">
            <h4 className="text-sm font-semibold text-[#2E7D32] dark:text-primary-400 mb-2">Threshing Summary</h4>
            <div className="space-y-1 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Paddy Input:</span>
                <span className="text-gray-900 dark:text-white font-medium">{formData.paddyQuantity} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Rice Output:</span>
                <span className="text-gray-900 dark:text-white font-medium">{formData.riceQuantity} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Broken Rice:</span>
                <span className="text-gray-900 dark:text-white font-medium">{formData.brokenRiceQuantity} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Husk:</span>
                <span className="text-gray-900 dark:text-white font-medium">{formData.huskQuantity} kg</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 pt-4">
          <NeonButton type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </NeonButton>
          <NeonButton type="submit" className="w-full sm:w-auto">
            <Wheat size={20} />
            Process Threshing
          </NeonButton>
        </div>
      </form>
    </Modal>
  );
};

export default ThreshingModal;
