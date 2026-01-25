import { useState } from 'react';
import Modal from '../ui/Modal';
import NeonButton from '../ui/NeonButton';
import { PADDY_TYPES, UNITS } from '../../utils/constants';
import { stockService } from '../../services/api/stockService';

const AddPaddyStockModal = ({ isOpen, onClose, onStockAdded }) => {
  const [formData, setFormData] = useState({
    paddyType: '',
    quantity: '',
    unit: 'kg',
    warehouse: '',
    moistureLevel: '',
    supplier: '',
    pricePerKg: '',
    status: 'In Stock'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await stockService.addPaddyStock(formData);
      onStockAdded(response.data);
      onClose();
      setFormData({
        paddyType: '',
        quantity: '',
        unit: 'kg',
        warehouse: '',
        moistureLevel: '',
        supplier: '',
        pricePerKg: '',
        status: 'In Stock'
      });
    } catch (error) {
      console.error('Failed to add paddy stock:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Paddy Stock">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paddy Type</label>
            <select
              name="paddyType"
              value={formData.paddyType}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Paddy Type</option>
              {PADDY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Warehouse</label>
            <input
              type="text"
              name="warehouse"
              value={formData.warehouse}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2"
            >
              {UNITS.map(unit => (
                <option key={unit} value={unit} className="bg-white dark:bg-dark-card text-gray-900 dark:text-white">{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Moisture Level (%)</label>
            <input
              type="number"
              step="0.1"
              name="moistureLevel"
              value={formData.moistureLevel}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Supplier</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price per kg</label>
          <input
            type="number"
            step="0.01"
            name="pricePerKg"
            value={formData.pricePerKg}
            onChange={handleChange}
            className="w-full glass-input rounded-lg px-3 py-2"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <NeonButton variant="outline" type="button" onClick={onClose}>
            Cancel
          </NeonButton>
          <NeonButton type="submit">
            Add Stock
          </NeonButton>
        </div>
      </form>
    </Modal>
  );
};

export default AddPaddyStockModal;