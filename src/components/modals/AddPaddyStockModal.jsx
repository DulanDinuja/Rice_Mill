import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import NeonButton from '../ui/NeonButton';
import { PADDY_TYPES, UNITS } from '../../utils/constants';
import { stockService } from '../../services/api/stockService';

const AddPaddyStockModal = ({ isOpen, onClose, onStockAdded, editMode = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    paddyType: '',
    quantity: '',
    bags: '',
    unit: 'kg',
    warehouse: '',
    moistureLevel: '',
    pricePerKg: '',
    customerName: '',
    customerId: '',
    mobileNumber: '',
    status: 'In Stock'
  });

  const [updateComment, setUpdateComment] = useState('');

  // Calculate total value automatically
  const totalValue = formData.quantity && formData.pricePerKg
    ? (parseFloat(formData.quantity) * parseFloat(formData.pricePerKg)).toFixed(2)
    : '0.00';

  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        paddyType: initialData.paddyType || '',
        quantity: initialData.quantity || '',
        bags: initialData.bags || '',
        unit: initialData.unit || 'kg',
        warehouse: initialData.warehouse || '',
        moistureLevel: initialData.moistureLevel || '',
        pricePerKg: initialData.pricePerKg || '',
        customerName: initialData.customerName || '',
        customerId: initialData.customerId || '',
        mobileNumber: initialData.mobileNumber || '',
        status: initialData.status || 'In Stock'
      });
    }
  }, [editMode, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const stockData = {
        ...formData,
        totalValue: parseFloat(totalValue),
        lastUpdated: new Date().toISOString()
      };

      if (editMode && initialData) {
        if (updateComment.trim()) {
          console.log('Paddy stock updated. Comment:', updateComment);
        }
        const response = await stockService.updatePaddyStock(initialData.id, stockData);
        onStockAdded({ ...response.data, id: initialData.id });
      } else {
        const response = await stockService.addPaddyStock(stockData);
        onStockAdded(response.data);
      }

      onClose();
      setUpdateComment('');
      if (!editMode) {
        setFormData({
          paddyType: '',
          quantity: '',
          bags: '',
          unit: 'kg',
          warehouse: '',
          moistureLevel: '',
          pricePerKg: '',
          customerName: '',
          customerId: '',
          mobileNumber: '',
          status: 'In Stock'
        });
      }
    } catch (error) {
      console.error(`Failed to ${editMode ? 'update' : 'add'} paddy stock:`, error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editMode ? "Edit Paddy Stock" : "Add Paddy Stock"}>
      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paddy Type</label>
            <select
              name="paddyType"
              value={formData.paddyType}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2 text-sm"
              required
            >
              <option value="">Select Paddy Type</option>
              {PADDY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
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
              className="w-full glass-input rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Supplier Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2 bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Enter supplier name"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Supplier ID</label>
            <input
              type="text"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2 bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50"
              placeholder="Enter supplier ID"
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
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
              placeholder="Number of bags"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity (kg)</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Moisture Level (%)</label>
            <input
              type="number"
              step="0.1"
              name="moistureLevel"
              value={formData.moistureLevel}
              onChange={handleChange}
              className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
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

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Value (Bill)</label>
          <input
            type="text"
            value={`Rs. ${totalValue}`}
            disabled
            className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white font-semibold cursor-not-allowed"
          />
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
              placeholder="Describe what changes you made and why... (e.g., 'Updated moisture level after testing')"
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

export default AddPaddyStockModal;