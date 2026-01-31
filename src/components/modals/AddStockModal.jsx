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
    customerName: '',
    customerId: '',
    mobileNumber: '',
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
        customerName: '',
        customerId: '',
        mobileNumber: '',
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
      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rice Type</label>
            <select
              name="riceType"
              value={formData.riceType}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2 bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
              required
            >
              <option value="" className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">Select Rice Type</option>
              {RICE_TYPES.map(type => (
                <option key={type} value={type} className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Warehouse</label>
            <input
              type="text"
              name="warehouse"
              value={formData.warehouse}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2 bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2 bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer ID</label>
            <input
              type="text"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2 bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Enter customer ID"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2 bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Enter mobile number"
            />
          </div>
          <div></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2 bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2 bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
            >
              {UNITS.map(unit => (
                <option key={unit} value={unit} className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grade</label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
            >
              {GRADES.map(grade => (
                <option key={grade} value={grade} className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">{grade}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price per kg</label>
            <input
              type="number"
              step="0.01"
              name="pricePerKg"
              value={formData.pricePerKg}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
              required
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 pt-4">
          <NeonButton variant="outline" type="button" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </NeonButton>
          <NeonButton type="submit" className="w-full sm:w-auto">
            Add Stock
          </NeonButton>
        </div>
      </form>
    </Modal>
  );
};

export default AddStockModal;