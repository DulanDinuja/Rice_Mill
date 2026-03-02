import { useState } from 'react';
import Modal from '../ui/Modal';
import NeonButton from '../ui/NeonButton';
import { Wheat, AlertCircle } from 'lucide-react';
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
  const [validationError, setValidationError] = useState('');

  // Calculate total rice output
  const getTotalRiceOutput = () => {
    const rice = parseFloat(formData.riceQuantity) || 0;
    const broken = parseFloat(formData.brokenRiceQuantity) || 0;
    const polish = parseFloat(formData.polishRiceQuantity) || 0;
    return rice + broken + polish;
  };

  // Validate quantities
  const validateQuantities = () => {
    const paddyQty = parseFloat(formData.paddyQuantity) || 0;
    const totalRiceOutput = getTotalRiceOutput();

    if (paddyQty > 0 && totalRiceOutput > paddyQty) {
      return `Total rice output (${totalRiceOutput} kg) cannot exceed paddy input (${paddyQty} kg)`;
    }
    return '';
  };

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

    // Clear validation error when user makes changes
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate: Paddy Quantity >= Rice + Broken Rice + Polish Rice
    const error = validateQuantities();
    if (error) {
      setValidationError(error);
      return;
    }

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
    setValidationError('');
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
              required
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
              required
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
              required
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
              required
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
          <div className={`${validateQuantities() ? 'bg-red-500/10 border-red-500/20' : 'bg-[#2E7D32]/10 border-[#2E7D32]/20 dark:bg-primary-500/10 dark:border-primary-500/20'} border rounded-lg p-3 md:p-4`}>
            <h4 className={`text-sm font-semibold ${validateQuantities() ? 'text-red-500' : 'text-[#2E7D32] dark:text-primary-400'} mb-2`}>Threshing Summary</h4>
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
              <div className="border-t border-gray-200 dark:border-white/10 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className={`font-medium ${validateQuantities() ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>Total Rice Output:</span>
                  <span className={`font-bold ${validateQuantities() ? 'text-red-500' : 'text-[#2E7D32] dark:text-primary-400'}`}>{getTotalRiceOutput()} kg</span>
                </div>
              </div>
              {validateQuantities() && (
                <div className="flex items-center gap-2 mt-2 text-red-500">
                  <AlertCircle size={16} />
                  <span className="text-xs">{validateQuantities()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Validation Error Message */}
        {validationError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="text-red-500" size={20} />
            <span className="text-red-500 text-sm">{validationError}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 pt-4">
          <NeonButton type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </NeonButton>
          <NeonButton
            type="submit"
            className="w-full sm:w-auto"
            disabled={!!validateQuantities()}
          >
            <Wheat size={20} />
            Process Threshing
          </NeonButton>
        </div>
      </form>
    </Modal>
  );
};

export default ThreshingModal;
