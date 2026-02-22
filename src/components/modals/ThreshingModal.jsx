import { useState } from 'react';
import Modal from '../ui/Modal';
import NeonButton from '../ui/NeonButton';
import { Wheat } from 'lucide-react';
import { PADDY_TYPES, RICE_TYPES } from '../../utils/constants';

const ThreshingModal = ({ isOpen, onClose, onThreshingComplete }) => {
  const [formData, setFormData] = useState({
    paddyType: '',
    paddyQuantity: '',
    riceType: '',
    riceQuantity: '',
    brokenRiceType: '',
    brokenRiceQuantity: '',
    polishRiceType: '',
    polishRiceQuantity: '',
    warehouse: '',
    threshingDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };

      // Auto-fill broken rice type and polish rice type when rice type is selected
      if (name === 'riceType') {
        updated.brokenRiceType = value;
        updated.polishRiceType = value;
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onThreshingComplete(formData);
    setFormData({
      paddyType: '',
      paddyQuantity: '',
      riceType: '',
      riceQuantity: '',
      brokenRiceType: '',
      brokenRiceQuantity: '',
      polishRiceType: '',
      polishRiceQuantity: '',
      warehouse: '',
      threshingDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Threshing Paddy">
      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        {/* Paddy Type Selection */}
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

        {/* Paddy Quantity */}
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
            className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
            placeholder="Enter quantity"
          />
        </div>

        {/* Warehouse */}
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

        {/* Rice Type */}
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
              placeholder="Enter rice quantity"
            />
          </div>
        </div>

        {/* Broken Rice Type & Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Broken Rice Type
            </label>
            <select
              name="brokenRiceType"
              value={formData.brokenRiceType}
              onChange={handleInputChange}
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
            >
              <option value="" className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">Select broken rice type...</option>
              {RICE_TYPES.map(type => (
                <option key={type} value={type} className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Broken Rice Quantity (kg)
            </label>
            <input
              type="number"
              name="brokenRiceQuantity"
              value={formData.brokenRiceQuantity}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Enter broken rice quantity"
            />
          </div>
        </div>

        {/* Polish Rice Type & Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Polish Rice Type
            </label>
            <select
              name="polishRiceType"
              value={formData.polishRiceType}
              onChange={handleInputChange}
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
            >
              <option value="" className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">Select polish rice type...</option>
              {RICE_TYPES.map(type => (
                <option key={type} value={type} className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Polish Rice Quantity (kg)
            </label>
            <input
              type="number"
              name="polishRiceQuantity"
              value={formData.polishRiceQuantity}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Enter polish rice quantity"
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
              {formData.riceQuantity && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Rice Output:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{formData.riceQuantity} kg</span>
                </div>
              )}
              {formData.brokenRiceQuantity && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Broken Rice:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{formData.brokenRiceQuantity} kg</span>
                </div>
              )}
              {formData.polishRiceQuantity && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Polish Rice:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{formData.polishRiceQuantity} kg</span>
                </div>
              )}
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
