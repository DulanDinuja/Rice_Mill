import { useState } from 'react';
import Modal from '../ui/Modal';
import NeonButton from '../ui/NeonButton';
import { RICE_TYPES, UNITS, GRADES } from '../../utils/constants';
import { stockService } from '../../services/api/stockService';

const AddStockModal = ({ isOpen, onClose, onStockAdded }) => {
  const [formData, setFormData] = useState({
    riceType: '',
    quantity: '',
    unit: 'kg',
    warehouse: '',
    grade: 'A',
    pricePerKg: '',
    status: 'In Stock'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await stockService.addRiceStock(formData);
      onStockAdded(response.data);
      onClose();
      setFormData({
        riceType: '',
        quantity: '',
        unit: 'kg',
        warehouse: '',
        grade: 'A',
        pricePerKg: '',
        status: 'In Stock'
      });
    } catch (error) {
      console.error('Failed to add stock:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Rice Stock">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rice Type</label>
            <select
              name="riceType"
              value={formData.riceType}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Rice Type</option>
              {RICE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Warehouse</label>
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Unit</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2"
            >
              {UNITS.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Grade</label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2"
            >
              {GRADES.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Price per kg</label>
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

export default AddStockModal;