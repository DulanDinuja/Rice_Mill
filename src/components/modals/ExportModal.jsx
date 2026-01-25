import { useState } from 'react';
import Modal from '../ui/Modal';
import NeonButton from '../ui/NeonButton';
import { Download, FileText, Table, ExternalLink } from 'lucide-react';

const ExportModal = ({ isOpen, onClose, title, onExport }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport({ format: exportFormat, dateRange });
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Export ${title}`}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Export Format</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setExportFormat('csv')}
              className={`p-4 rounded-lg border-2 transition-all ${
                exportFormat === 'csv'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <Table className="mx-auto mb-2" size={24} />
              <div className="text-white font-medium">CSV</div>
              <div className="text-gray-400 text-xs">Direct download</div>
            </button>
            <button
              onClick={() => setExportFormat('pdf')}
              className={`p-4 rounded-lg border-2 transition-all ${
                exportFormat === 'pdf'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <FileText className="mx-auto mb-2" size={24} />
              <div className="text-white font-medium">Preview</div>
              <div className="text-gray-400 text-xs">New window</div>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full glass-input rounded-lg px-3 py-2"
          >
            <option value="all">All Records</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ExternalLink className="text-blue-600 dark:text-blue-400 mt-0.5" size={16} />
            <div>
              <div className="text-blue-700 dark:text-blue-400 font-medium text-sm">Export Options</div>
              <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                {exportFormat === 'csv'
                  ? 'CSV file will be downloaded directly to your computer'
                  : 'Preview will open in a new window with print and download options'
                }
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <NeonButton variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </NeonButton>
          <NeonButton onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </div>
            ) : (
              <>
                <Download size={20} />
                {exportFormat === 'csv' ? 'Download' : 'Preview'}
              </>
            )}
          </NeonButton>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;