import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import NeonButton from '../ui/NeonButton';
import { RICE_TYPES, UNITS } from '../../utils/constants';
import { stockService } from '../../services/api/stockService';

const AddStockModal = ({ isOpen, onClose, onStockAdded, editMode = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    riceType: '',
    quantity: '',
    unit: 'kg',
    pricePerKg: '',
    customerName: '',
    customerId: '',
    mobileNumber: '',
    bags: '',
    status: 'In Stock'
  });
  const [updateComment, setUpdateComment] = useState('');

  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        riceType: initialData.riceType || '',
        quantity: initialData.quantity || '',
        unit: initialData.unit || 'kg',
        pricePerKg: initialData.pricePerKg || '',
        customerName: initialData.customerName || '',
        customerId: initialData.customerId || '',
        mobileNumber: initialData.mobileNumber || '',
        bags: initialData.bags || '',
        status: initialData.status || 'In Stock'
      });
    }
  }, [editMode, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const stockData = {
        ...formData,
        lastUpdated: new Date().toISOString()
      };

      if (editMode && initialData) {
        if (updateComment.trim()) {
          console.log('Stock updated. Comment:', updateComment);
        }
        const response = await stockService.updateRiceStock(initialData.id, stockData);
        onStockAdded({ ...response.data, id: initialData.id });
      } else {
        const response = await stockService.addRiceStock(stockData);
        onStockAdded(response.data);
      }

      onClose();
      setUpdateComment('');
      if (!editMode) {
        setFormData({
          riceType: '',
          quantity: '',
          unit: 'kg',
          pricePerKg: '',
          customerName: '',
          customerId: '',
          mobileNumber: '',
          bags: '',
          status: 'In Stock'
        });
      }
    } catch (error) {
      console.error(`Failed to ${editMode ? 'update' : 'add'} stock:`, error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editMode ? "Edit Rice Stock" : "Add Rice Stock"}>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
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
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bags</label>
            <input
              type="number"
              name="bags"
              value={formData.bags}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2 bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
              placeholder="Number of bags"
            />
          </div>
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

        {editMode && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Update Comment (Optional)
            </label>
            <textarea
              value={updateComment}
              onChange={(e) => setUpdateComment(e.target.value)}
              className="w-full glass-input rounded-lg px-3 py-2 bg-white dark:bg-white/[0.06] border border-blue-300 dark:border-blue-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 min-h-[80px]"
              placeholder="Describe what changes you made and why... (e.g., 'Updated quantity after inventory count')"
            />
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              This comment will be logged with the update for record keeping.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 pt-4">
          <NeonButton variant="outline" type="button" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </NeonButton>
          <NeonButton type="submit" className="w-full sm:w-auto">
            {editMode ? 'Update Stock' : 'Add Stock'}
          </NeonButton>
        </div>
      </form>
    </Modal>
  );
};

export default AddStockModal;