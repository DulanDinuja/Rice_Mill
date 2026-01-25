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
      <div className="space-y-4 md:space-y-6">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Export Format</label>
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <button
              onClick={() => setExportFormat('csv')}
              className={`p-3 md:p-4 rounded-lg border-2 transition-all ${
                exportFormat === 'csv'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <Table className="mx-auto mb-1 md:mb-2" size={20} />
              <div className="text-white font-medium text-sm md:text-base">CSV</div>
              <div className="text-gray-400 text-xs">Direct download</div>
            </button>
            <button
              onClick={() => setExportFormat('pdf')}
              className={`p-3 md:p-4 rounded-lg border-2 transition-all ${
                exportFormat === 'pdf'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <FileText className="mx-auto mb-1 md:mb-2" size={20} />
              <div className="text-white font-medium text-sm md:text-base">Preview</div>
              <div className="text-gray-400 text-xs">New window</div>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full glass-input rounded-lg px-3 py-2 text-sm bg-white dark:bg-white/[0.06] border border-gray-300 dark:border-white/[0.08] text-gray-900 dark:text-white"
          >
            <option value="all" className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">All Records</option>
            <option value="today" className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">Today</option>
            <option value="week" className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">This Week</option>
            <option value="month" className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">This Month</option>
            <option value="year" className="bg-white dark:bg-[#1A1A2E] text-gray-900 dark:text-white">This Year</option>
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20 rounded-lg p-3 md:p-4">
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

        <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 pt-4">
          <NeonButton variant="outline" onClick={onClose} disabled={isExporting} className="w-full sm:w-auto">
            Cancel
          </NeonButton>
          <NeonButton onClick={handleExport} disabled={isExporting} className="w-full sm:w-auto">
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