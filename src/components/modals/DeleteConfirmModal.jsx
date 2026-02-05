import { useState } from 'react';
import Modal from '../ui/Modal';
import NeonButton from '../ui/NeonButton';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirmed && reason.trim()) {
      onConfirm(reason);
      handleClose();
    }
  };

  const handleClose = () => {
    setReason('');
    setConfirmed(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Delete Confirmation">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Warning Icon and Message */}
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertTriangle className="text-red-600 dark:text-red-400 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100 text-sm md:text-base">
              Are you sure you want to delete this item?
            </h3>
            <p className="text-xs md:text-sm text-red-700 dark:text-red-300 mt-1">
              {itemName && <span className="font-medium">"{itemName}"</span>}
              {' '}This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Reason Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reason for deletion <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full glass-input rounded-lg px-3 py-2 bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 min-h-[100px]"
            placeholder="Please provide a reason for deleting this stock item..."
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This will be logged for record keeping.
          </p>
        </div>

        {/* Confirmation Checkbox */}
        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] rounded-lg">
          <input
            type="checkbox"
            id="confirmDelete"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="confirmDelete" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            I understand that this action is permanent and cannot be undone. I confirm that I want to delete this stock item.
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 pt-2">
          <NeonButton
            variant="outline"
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </NeonButton>
          <NeonButton
            type="submit"
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            disabled={!confirmed || !reason.trim()}
          >
            Delete Stock
          </NeonButton>
        </div>
      </form>
    </Modal>
  );
};

export default DeleteConfirmModal;
