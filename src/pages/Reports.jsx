import { useState, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import ReportFilters from '../components/reports/ReportFilters';
import ReportTable from '../components/reports/ReportTable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, Line, AreaChart, Area, ComposedChart } from 'recharts';
import { reportsService } from '../services/reportsService';
import { Download, FileText, TrendingUp, DollarSign, Wheat, Box, Package, Activity, Layers, Printer } from 'lucide-react';
import { motion } from 'framer-motion';

// Color palette for charts
const COLORS = {
  green: '#2E7D32',
  greenLight: '#4CAF50',
  purple: '#8B5CF6',
  purpleLight: '#A78BFA',
  orange: '#F97316',
  orangeLight: '#FB923C',
  blue: '#3B82F6',
  blueLight: '#60A5FA'
};

const Reports = () => {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    reportType: '',
    warehouse: '',
    paddyType: '',
    riceType: '',
    supplier: ''
  });

  const [reportData, setReportData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [systemData, setSystemData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Initialize warehouses and suppliers
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [warehousesRes, suppliersRes, systemDataRes] = await Promise.all([
          reportsService.getWarehouses(),
          reportsService.getSuppliers(),
          reportsService.getAllSystemData()
        ]);
        setWarehouses(warehousesRes.data || []);
        setSuppliers(suppliersRes.data || []);
        setSystemData(systemDataRes.data);
      } catch (error) {
        console.error('Error loading filters:', error);
        setWarehouses([]);
        setSuppliers([]);
      }
    };
    loadFilters();
  }, []);

  const handleGenerateReport = async () => {
    if (!filters.reportType) {
      alert('Please select a report type');
      return;
    }

    // Validate date range
    if (filters.fromDate && filters.toDate) {
      const from = new Date(filters.fromDate);
      const to = new Date(filters.toDate);
      if (from > to) {
        alert('From Date must be earlier than To Date');
        return;
      }
    }

    setLoading(true);
    try {
      const result = await reportsService.getReports(
        filters.fromDate,
        filters.toDate,
        filters.reportType,
        {
          warehouse: filters.warehouse,
          paddyType: filters.paddyType,
          riceType: filters.riceType,
          supplier: filters.supplier
        }
      );

      if (result.success) {
        setReportData(result.data);

        // Generate chart data
        const chart = await reportsService.getChartData(
          filters.fromDate,
          filters.toDate,
          filters.reportType
        );
        setChartData(chart);
      } else {
        alert('Error generating report: ' + result.error);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!filters.reportType || reportData.length === 0) {
      alert('Please generate a report first');
      return;
    }

    // Determine report type name (handle both uppercase and lowercase)
    const normalizedType = filters.reportType.toUpperCase();
    const reportTypeNames = {
      PADDY_THRESHING: 'Paddy Threshing Report',
      PADDY_SALE: 'Paddy Sale Report',
      PADDY_STOCK: 'Paddy Stock Report',
      RICE_SALE: 'Rice Sale Report',
      RICE_STOCK: 'Rice Stock Report'
    };

    const reportTypeName = reportTypeNames[normalizedType] || 'Report';
    const isPaddyThreshing = normalizedType === 'PADDY_THRESHING';
    const isPaddySale = normalizedType === 'PADDY_SALE';
    const isPaddyStock = normalizedType === 'PADDY_STOCK';
    const isRiceSale = normalizedType === 'RICE_SALE';

    // Create CSV content based on report type
    let headers, rows;

    if (isPaddyThreshing) {
      headers = ['Paddy Type', 'Paddy Qty (kg)', 'Rice Type', 'Rice Qty (kg)', 'Broken Rice Type', 'Broken Qty (kg)', 'Polish Rice Type', 'Polish Qty (kg)', 'Warehouse', 'User', 'Date'];
      rows = reportData.map(row => [
        row.paddyType || 'N/A',
        row.paddyQuantity || 0,
        row.riceType || 'N/A',
        row.riceQuantity || 0,
        row.brokenRiceType || 'N/A',
        row.brokenRiceQuantity || 0,
        row.polishRiceType || 'N/A',
        row.polishRiceQuantity || 0,
        row.warehouse || 'N/A',
        row.user || 'N/A',
        row.date ? new Date(row.date).toLocaleDateString() : 'N/A'
      ]);
    } else if (isPaddySale) {
      headers = ['Paddy Type', 'Quantity (kg)', 'Price/kg', 'Total Amount', 'Customer Name', 'Customer ID', 'Mobile', 'Warehouse', 'Date'];
      rows = reportData.map(row => [
        row.paddyType || 'N/A',
        row.quantity || row.paddyQuantity || 0,
        row.pricePerKg || 'N/A',
        row.totalAmount || row.totalPrice || 0,
        row.customerName || row.customer || 'N/A',
        row.customerId || 'N/A',
        row.mobileNumber || 'N/A',
        row.warehouse || 'N/A',
        row.date ? new Date(row.date).toLocaleDateString() : 'N/A'
      ]);
    } else if (isPaddyStock) {
      headers = ['Paddy Type', 'Quantity (kg)', 'Moisture %', 'Warehouse', 'Supplier', 'User', 'Date'];
      rows = reportData.map(row => [
        row.paddyType || 'N/A',
        row.quantity || row.paddyQuantity || 0,
        row.moistureLevel || 'N/A',
        row.warehouse || 'N/A',
        row.supplier || row.supplierName || 'N/A',
        row.user || 'N/A',
        row.date ? new Date(row.date).toLocaleDateString() : 'N/A'
      ]);
    } else if (isRiceSale) {
      headers = ['Rice Type', 'Quantity (kg)', 'Price/kg', 'Total Price', 'Customer', 'Mobile', 'Date'];
      rows = reportData.map(row => [
        row.riceType || 'N/A',
        row.quantity || row.riceQuantity || 0,
        row.pricePerKg || 'N/A',
        row.totalAmount || row.totalPrice || 0,
        row.customerName || row.customer || 'N/A',
        row.mobileNumber || 'N/A',
        row.date ? new Date(row.date).toLocaleDateString() : 'N/A'
      ]);
    } else {
      // Rice Stock or other rice reports
      headers = ['Rice Type', 'Quantity (kg)', 'Price/kg', 'Total Amount', 'Supplier', 'Mobile', 'User', 'Date'];
      rows = reportData.map(row => [
        row.riceType || 'N/A',
        row.quantity || row.riceQuantity || 0,
        row.pricePerKg || 0,
        row.totalAmount || row.totalPrice || 0,
        row.supplierName || row.supplier || 'N/A',
        row.mobileNumber || 'N/A',
        row.user || 'N/A',
        row.date ? new Date(row.date).toLocaleDateString() : 'N/A'
      ]);
    }

    const csvContent = [
      [reportTypeName],
      [`Generated: ${new Date().toLocaleString()}`],
      [`Date Range: ${filters.fromDate || 'All'} to ${filters.toDate || 'All'}`],
      [],
      headers,
      ...rows
    ].map(row => row.join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportTypeName.replace(/\s+/g, '_')}_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    if (!filters.reportType || reportData.length === 0) {
      alert('Please generate a report first');
      return;
    }

    // Determine report type name (handle both uppercase and lowercase)
    const normalizedType = filters.reportType.toUpperCase();
    const reportTypeNames = {
      PADDY_THRESHING: 'Paddy Threshing Report',
      PADDY_SALE: 'Paddy Sale Report',
      PADDY_STOCK: 'Paddy Stock Report',
      RICE_SALE: 'Rice Sale Report',
      RICE_STOCK: 'Rice Stock Report'
    };

    const reportTypeName = reportTypeNames[normalizedType] || 'Report';
    const isPaddyThreshing = normalizedType === 'PADDY_THRESHING';
    const isPaddySale = normalizedType === 'PADDY_SALE';
    const isPaddyStock = normalizedType === 'PADDY_STOCK';
    const isPaddyReport = normalizedType.includes('PADDY');
    const isRiceSale = normalizedType === 'RICE_SALE';

    // Create print window
    const printWindow = window.open('', '_blank');

    // Generate table HTML based on report type
    let tableHeaders, tableRows, totalQuantity, totalAmount;

    if (isPaddyThreshing) {
      tableHeaders = ['#', 'Paddy Type', 'Paddy Qty', 'Rice Type', 'Rice Qty', 'Broken Rice', 'Broken Qty', 'Polish Rice', 'Polish Qty', 'Warehouse', 'User', 'Date'];
      tableRows = reportData.map((row, index) => `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${row.paddyType || 'N/A'}</strong></td>
          <td>${(row.paddyQuantity || 0).toLocaleString()} kg</td>
          <td>${row.riceType || 'N/A'}</td>
          <td>${(row.riceQuantity || 0).toLocaleString()} kg</td>
          <td>${row.brokenRiceType || 'N/A'}</td>
          <td>${(row.brokenRiceQuantity || 0).toLocaleString()} kg</td>
          <td>${row.polishRiceType || 'N/A'}</td>
          <td>${(row.polishRiceQuantity || 0).toLocaleString()} kg</td>
          <td>${row.warehouse || 'N/A'}</td>
          <td>${row.user || 'N/A'}</td>
          <td>${row.date ? new Date(row.date).toLocaleDateString() : 'N/A'}</td>
        </tr>
      `).join('');
      totalQuantity = reportData.reduce((sum, item) => sum + (item.paddyQuantity || 0), 0);
      totalAmount = 0;
    } else if (isPaddySale) {
      tableHeaders = ['#', 'Paddy Type', 'Quantity', 'Price/kg', 'Total Amount', 'Customer', 'Customer ID', 'Mobile', 'Warehouse', 'Date'];
      tableRows = reportData.map((row, index) => `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${row.paddyType || 'N/A'}</strong></td>
          <td>${(row.quantity || row.paddyQuantity || 0).toLocaleString()} kg</td>
          <td>Rs. ${(row.pricePerKg || 0).toLocaleString()}</td>
          <td><strong>Rs. ${(row.totalAmount || row.totalPrice || 0).toLocaleString()}</strong></td>
          <td>${row.customerName || row.customer || 'N/A'}</td>
          <td>${row.customerId || 'N/A'}</td>
          <td>${row.mobileNumber || 'N/A'}</td>
          <td>${row.warehouse || 'N/A'}</td>
          <td>${row.date ? new Date(row.date).toLocaleDateString() : 'N/A'}</td>
        </tr>
      `).join('');
      totalQuantity = reportData.reduce((sum, item) => sum + (item.quantity || item.paddyQuantity || 0), 0);
      totalAmount = reportData.reduce((sum, item) => sum + (item.totalAmount || item.totalPrice || 0), 0);
    } else if (isPaddyStock) {
      tableHeaders = ['#', 'Paddy Type', 'Quantity', 'Moisture %', 'Warehouse', 'Supplier', 'User', 'Date'];
      tableRows = reportData.map((row, index) => `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${row.paddyType || 'N/A'}</strong></td>
          <td>${(row.quantity || row.paddyQuantity || 0).toLocaleString()} kg</td>
          <td>${row.moistureLevel || 'N/A'}%</td>
          <td>${row.warehouse || 'N/A'}</td>
          <td>${row.supplier || row.supplierName || 'N/A'}</td>
          <td>${row.user || 'N/A'}</td>
          <td>${row.date ? new Date(row.date).toLocaleDateString() : 'N/A'}</td>
        </tr>
      `).join('');
      totalQuantity = reportData.reduce((sum, item) => sum + (item.quantity || item.paddyQuantity || 0), 0);
      totalAmount = 0;
    } else if (isRiceSale) {
      tableHeaders = ['#', 'Rice Type', 'Quantity', 'Price/kg', 'Total Amount', 'Customer', 'Mobile', 'Date'];
      tableRows = reportData.map((row, index) => `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${row.riceType || 'N/A'}</strong></td>
          <td>${(row.quantity || row.riceQuantity || 0).toLocaleString()} kg</td>
          <td>Rs. ${(row.pricePerKg || 0).toLocaleString()}</td>
          <td><strong>Rs. ${(row.totalAmount || row.totalPrice || 0).toLocaleString()}</strong></td>
          <td>${row.customerName || row.customer || 'N/A'}</td>
          <td>${row.mobileNumber || 'N/A'}</td>
          <td>${row.date ? new Date(row.date).toLocaleDateString() : 'N/A'}</td>
        </tr>
      `).join('');
      totalQuantity = reportData.reduce((sum, item) => sum + (item.quantity || item.riceQuantity || 0), 0);
      totalAmount = reportData.reduce((sum, item) => sum + (item.totalAmount || item.totalPrice || 0), 0);
    } else {
      // Rice Stock
      tableHeaders = ['#', 'Rice Type', 'Quantity', 'Price/kg', 'Total Amount', 'Supplier', 'Mobile', 'User', 'Date'];
      tableRows = reportData.map((row, index) => `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${row.riceType || 'N/A'}</strong></td>
          <td>${(row.quantity || row.riceQuantity || 0).toLocaleString()} kg</td>
          <td>Rs. ${(row.pricePerKg || 0).toLocaleString()}</td>
          <td><strong>Rs. ${(row.totalAmount || row.totalPrice || 0).toLocaleString()}</strong></td>
          <td>${row.supplierName || row.supplier || 'N/A'}</td>
          <td>${row.mobileNumber || 'N/A'}</td>
          <td>${row.user || 'N/A'}</td>
          <td>${row.date ? new Date(row.date).toLocaleDateString() : 'N/A'}</td>
        </tr>
      `).join('');
      totalQuantity = reportData.reduce((sum, item) => sum + (item.quantity || item.riceQuantity || 0), 0);
      totalAmount = reportData.reduce((sum, item) => sum + (item.totalAmount || item.totalPrice || 0), 0);
    }

    // Calculate additional summaries based on report type
    let additionalSummary;
    if (isPaddyThreshing) {
      additionalSummary = `
        <div class="summary-card orange">
          <div class="summary-label">Total Rice Produced</div>
          <div class="summary-value">${reportData.reduce((sum, item) => sum + (item.riceQuantity || 0), 0).toLocaleString()} kg</div>
        </div>
        <div class="summary-card purple">
          <div class="summary-label">Total Broken Rice</div>
          <div class="summary-value">${reportData.reduce((sum, item) => sum + (item.brokenRiceQuantity || 0), 0).toLocaleString()} kg</div>
        </div>
      `;
    } else if (isPaddySale || isRiceSale) {
      additionalSummary = `
        <div class="summary-card orange">
          <div class="summary-label">Total Sales Amount</div>
          <div class="summary-value">Rs. ${totalAmount.toLocaleString()}</div>
        </div>
        <div class="summary-card purple">
          <div class="summary-label">Report Type</div>
          <div class="summary-value" style="font-size: 14px;">${isPaddyReport ? 'Paddy Sale' : 'Rice Sale'}</div>
        </div>
      `;
    } else {
      additionalSummary = `
        <div class="summary-card purple">
          <div class="summary-label">Report Type</div>
          <div class="summary-value" style="font-size: 14px;">${isPaddyReport ? 'Paddy Stock' : 'Rice Stock'}</div>
        </div>
      `;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportTypeName}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            background: #fff;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2E7D32;
          }
          .logo-section {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
          }
          .logo {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #2E7D32, #4CAF50);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: bold;
          }
          .company-name {
            font-size: 28px;
            font-weight: 700;
            color: #2E7D32;
          }
          .report-title {
            font-size: 22px;
            color: #333;
            margin-top: 10px;
            font-weight: 600;
          }
          .meta-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #f8fdf8, #e8f5e9);
            border-radius: 12px;
            border: 1px solid #c8e6c9;
          }
          .meta-item {
            text-align: center;
          }
          .meta-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .meta-value {
            font-size: 16px;
            font-weight: 600;
            color: #2E7D32;
            margin-top: 5px;
          }
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .summary-card {
            padding: 20px;
            border-radius: 12px;
            text-align: center;
          }
          .summary-card.green {
            background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
            border: 1px solid #a5d6a7;
          }
          .summary-card.blue {
            background: linear-gradient(135deg, #e3f2fd, #bbdefb);
            border: 1px solid #90caf9;
          }
          .summary-card.purple {
            background: linear-gradient(135deg, #f3e5f5, #e1bee7);
            border: 1px solid #ce93d8;
          }
          .summary-card.orange {
            background: linear-gradient(135deg, #fff3e0, #ffe0b2);
            border: 1px solid #ffcc80;
          }
          .summary-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .summary-value {
            font-size: 24px;
            font-weight: 700;
            margin-top: 8px;
          }
          .summary-card.green .summary-value { color: #2E7D32; }
          .summary-card.blue .summary-value { color: #1976D2; }
          .summary-card.purple .summary-value { color: #7B1FA2; }
          .summary-card.orange .summary-value { color: #E65100; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border-radius: 12px;
            overflow: hidden;
          }
          th {
            background: linear-gradient(135deg, #2E7D32, #388E3C);
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          td {
            padding: 14px 12px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 14px;
          }
          tr:nth-child(even) {
            background-color: #f8fdf8;
          }
          tr:hover {
            background-color: #e8f5e9;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #666;
          }
          .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            padding-top: 40px;
          }
          .signature-box {
            text-align: center;
            width: 200px;
          }
          .signature-line {
            border-top: 2px solid #333;
            margin-bottom: 10px;
          }
          .signature-label {
            font-size: 14px;
            color: #333;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo-section">
            <div class="logo">RM</div>
            <span class="company-name">Rice Mill Management</span>
          </div>
          <div class="report-title">${reportTypeName}</div>
        </div>

        <div class="meta-info">
          <div class="meta-item">
            <div class="meta-label">Report Generated</div>
            <div class="meta-value">${new Date().toLocaleString()}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Date Range</div>
            <div class="meta-value">${filters.fromDate || 'All Time'} to ${filters.toDate || 'Today'}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Warehouse</div>
            <div class="meta-value">${filters.warehouse || 'All Warehouses'}</div>
          </div>
        </div>

        <div class="summary-cards">
          <div class="summary-card green">
            <div class="summary-label">Total Records</div>
            <div class="summary-value">${reportData.length}</div>
          </div>
          <div class="summary-card blue">
            <div class="summary-label">${isPaddyThreshing ? 'Total Paddy Processed' : 'Total Quantity'}</div>
            <div class="summary-value">${totalQuantity.toLocaleString()} kg</div>
          </div>
          ${additionalSummary}
        </div>

        <table>
          <thead>
            <tr>
              ${tableHeaders.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-label">Prepared By</div>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-label">Verified By</div>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-label">Approved By</div>
          </div>
        </div>

        <div class="footer">
          <div>Rice Mill Management System © ${new Date().getFullYear()}</div>
          <div>Page 1 of 1</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-gaming font-bold text-gray-900 dark:text-white mb-1 md:mb-2">
          Reports & Analytics
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          Generate detailed reports with custom filters
        </p>
      </div>

      {/* System Summary Cards */}
      {systemData && systemData.summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Paddy Stock Card - Green */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10
                     border border-green-200 dark:border-green-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Wheat className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Paddy Stock</p>
                <p className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-400">
                  {(systemData.summary?.totalPaddyStock || 0).toLocaleString()} kg
                </p>
              </div>
            </div>
          </motion.div>

          {/* Rice Stock Card - Purple */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-500/10 dark:to-violet-500/10
                     border border-purple-200 dark:border-purple-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Box className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Rice Stock</p>
                <p className="text-xl md:text-2xl font-bold text-purple-700 dark:text-purple-400">
                  {(systemData.summary?.totalRiceStock || 0).toLocaleString()} kg
                </p>
              </div>
            </div>
          </motion.div>

          {/* Paddy Sales Card - Orange */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10
                     border border-orange-200 dark:border-orange-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Paddy Sales Revenue</p>
                <p className="text-xl md:text-2xl font-bold text-orange-700 dark:text-orange-400">
                  Rs. {(systemData.summary?.totalPaddySales || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Rice Sales Card - Blue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10
                     border border-blue-200 dark:border-blue-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Rice Sales Revenue</p>
                <p className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400">
                  Rs. {(systemData.summary?.totalRiceSales || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Additional Stock Info Cards */}
      {systemData && systemData.summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Broken Rice - Green Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#2E7D32]/10 border border-[#2E7D32]/20 dark:bg-green-500/10 dark:border-green-500/20 rounded-xl p-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-[#2E7D32] dark:text-green-400 font-medium">Total Broken Rice:</span>
              <span className="text-[#2E7D32] dark:text-green-400 text-xl font-bold">
                {(systemData.summary?.totalBrokenRice || 0).toLocaleString()} kg
              </span>
            </div>
          </motion.div>

          {/* Polish Rice - Green Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-[#2E7D32]/10 border border-[#2E7D32]/20 dark:bg-green-500/10 dark:border-green-500/20 rounded-xl p-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-[#2E7D32] dark:text-green-400 font-medium">Total Polish Rice:</span>
              <span className="text-[#2E7D32] dark:text-green-400 text-xl font-bold">
                {(systemData.summary?.totalPolishRice || 0).toLocaleString()} kg
              </span>
            </div>
          </motion.div>

          {/* Total Revenue - Green Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#2E7D32]/10 border border-[#2E7D32]/20 dark:bg-green-500/10 dark:border-green-500/20 rounded-xl p-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-[#2E7D32] dark:text-green-400 font-medium">Total Revenue:</span>
              <span className="text-[#2E7D32] dark:text-green-400 text-xl font-bold">
                Rs. {((systemData.summary?.totalPaddySales || 0) + (systemData.summary?.totalRiceSales || 0)).toLocaleString()}
              </span>
            </div>
          </motion.div>
        </div>
      )}

      {/* System Overview Charts */}
      {systemData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <GlassCard>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">Stock Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Paddy Stock', value: systemData.summary?.totalPaddyStock || 0, fill: '#2E7D32' },
                { name: 'Rice Stock', value: systemData.summary?.totalRiceStock || 0, fill: '#8B5CF6' },
                { name: 'Broken Rice', value: systemData.summary?.totalBrokenRice || 0, fill: '#F97316' },
                { name: 'Polish Rice', value: systemData.summary?.totalPolishRice || 0, fill: '#3B82F6' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(46, 125, 50, 0.2)" />
                <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 12 }} />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(46, 125, 50, 0.3)',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value.toLocaleString()} kg`, 'Quantity']}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {[
                    { name: 'Paddy Stock', fill: '#2E7D32' },
                    { name: 'Rice Stock', fill: '#8B5CF6' },
                    { name: 'Broken Rice', fill: '#F97316' },
                    { name: 'Polish Rice', fill: '#3B82F6' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">Revenue Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Paddy Sales', value: systemData.summary?.totalPaddySales || 0 },
                    { name: 'Rice Sales', value: systemData.summary?.totalRiceSales || 0 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#F97316" />
                  <Cell fill="#3B82F6" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(46, 125, 50, 0.3)',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`Rs. ${value.toLocaleString()}`, 'Revenue']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      )}

      {/* Inventory by Type Charts */}
      {systemData && (systemData.paddyData || systemData.riceData) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Paddy Stock by Type */}
          {systemData.paddyData && Object.keys(systemData.paddyData).length > 0 && (
            <GlassCard>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                <span className="flex items-center gap-2">
                  <Wheat className="w-5 h-5 text-green-600" />
                  Paddy Stock by Type
                </span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(systemData.paddyData).map(([type, data]) => ({
                  name: type,
                  stock: data.totalStock || 0,
                  sales: data.totalSales || 0,
                  revenue: data.totalRevenue || 0
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(46, 125, 50, 0.2)" />
                  <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: '1px solid rgba(46, 125, 50, 0.3)',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => [
                      name === 'revenue' ? `Rs. ${value.toLocaleString()}` : `${value.toLocaleString()} kg`,
                      name === 'stock' ? 'Stock' : name === 'sales' ? 'Sold' : 'Revenue'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="stock" name="Stock (kg)" fill="#2E7D32" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sales" name="Sold (kg)" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          )}

          {/* Rice Stock by Type */}
          {systemData.riceData && Object.keys(systemData.riceData).length > 0 && (
            <GlassCard>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                <span className="flex items-center gap-2">
                  <Box className="w-5 h-5 text-purple-600" />
                  Rice Stock by Type
                </span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(systemData.riceData).map(([type, data]) => ({
                  name: type,
                  stock: data.totalStock || 0,
                  broken: data.totalBrokenRice || 0,
                  polish: data.totalPolishRice || 0,
                  sales: data.totalSales || 0
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
                  <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value.toLocaleString()} kg`, 'Quantity']}
                  />
                  <Legend />
                  <Bar dataKey="stock" name="Stock (kg)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="broken" name="Broken Rice (kg)" fill="#F97316" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="polish" name="Polish Rice (kg)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          )}
        </div>
      )}

      {/* Stock vs Sales Comparison Charts */}
      {systemData && (systemData.paddyData || systemData.riceData) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Paddy Stock vs Sales Pie Chart */}
          {systemData.paddyData && Object.keys(systemData.paddyData).length > 0 && (
            <GlassCard>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                <span className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Paddy Stock Distribution
                </span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(systemData.paddyData).map(([type, data]) => ({
                      name: type,
                      value: data.totalStock || 0
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {Object.keys(systemData.paddyData).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={[COLORS.green, COLORS.greenLight, COLORS.orange, COLORS.blue][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: '1px solid rgba(46, 125, 50, 0.3)',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value.toLocaleString()} kg`, 'Stock']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>
          )}

          {/* Rice Stock Distribution Pie Chart */}
          {systemData.riceData && Object.keys(systemData.riceData).length > 0 && (
            <GlassCard>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                <span className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  Rice Stock Distribution
                </span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(systemData.riceData).map(([type, data]) => ({
                      name: type,
                      value: data.totalStock || 0
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {Object.keys(systemData.riceData).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={[COLORS.purple, COLORS.purpleLight, COLORS.blue, COLORS.orange][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value.toLocaleString()} kg`, 'Stock']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>
          )}
        </div>
      )}

      {/* Revenue Analysis Charts */}
      {systemData && (systemData.paddyData || systemData.riceData) && (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <GlassCard>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Revenue by Product Type
              </span>
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={[
                ...Object.entries(systemData.paddyData || {}).map(([type, data]) => ({
                  name: `Paddy: ${type}`,
                  revenue: data.totalRevenue || 0,
                  quantity: data.totalSales || 0,
                  category: 'Paddy'
                })),
                ...Object.entries(systemData.riceData || {}).map(([type, data]) => ({
                  name: `Rice: ${type}`,
                  revenue: data.totalRevenue || 0,
                  quantity: data.totalSales || 0,
                  category: 'Rice'
                }))
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.2)" />
                <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={80} />
                <YAxis yAxisId="left" stroke={COLORS.green} label={{ value: 'Revenue (Rs.)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" stroke={COLORS.blue} label={{ value: 'Quantity (kg)', angle: 90, position: 'insideRight' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [
                    name === 'revenue' ? `Rs. ${value.toLocaleString()}` : `${value.toLocaleString()} kg`,
                    name === 'revenue' ? 'Revenue' : 'Quantity Sold'
                  ]}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue (Rs.)" fill={COLORS.green} radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="quantity" name="Quantity Sold (kg)" stroke={COLORS.blue} strokeWidth={3} dot={{ fill: COLORS.blue, r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      )}

      {/* Inventory Overview - Full Width Area Chart */}
      {systemData && systemData.summary && (
        <GlassCard>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            <span className="flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600" />
              Complete Inventory Overview
            </span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/30 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Paddy Types</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">{Object.keys(systemData.paddyData || {}).length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-500/10 dark:to-violet-500/10 border border-purple-200 dark:border-purple-500/30 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Rice Types</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{Object.keys(systemData.riceData || {}).length}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 border border-orange-200 dark:border-orange-500/30 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Threshing Records</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">{(systemData.threshingData || []).length}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-lg md:text-2xl font-bold text-blue-700 dark:text-blue-400">Rs. {((systemData.summary?.totalPaddySales || 0) + (systemData.summary?.totalRiceSales || 0)).toLocaleString()}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={[
              { name: 'Paddy Stock', value: systemData.summary?.totalPaddyStock || 0, fill: COLORS.green },
              { name: 'Rice Stock', value: systemData.summary?.totalRiceStock || 0, fill: COLORS.purple },
              { name: 'Broken Rice', value: systemData.summary?.totalBrokenRice || 0, fill: COLORS.orange },
              { name: 'Polish Rice', value: systemData.summary?.totalPolishRice || 0, fill: COLORS.blue }
            ]}>
              <defs>
                <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.green} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(46, 125, 50, 0.2)" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  border: '1px solid rgba(46, 125, 50, 0.3)',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value.toLocaleString()} kg`, 'Quantity']}
              />
              <Area type="monotone" dataKey="value" stroke={COLORS.green} fill="url(#colorGreen)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* Threshing Data Table */}
      {systemData && systemData.threshingData && systemData.threshingData.length > 0 && (
        <GlassCard>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Threshing Operations
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10">
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Paddy Type</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Paddy Qty</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Rice Type</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Rice Qty</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Broken Rice</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Polish Rice</th>
                </tr>
              </thead>
              <tbody>
                {systemData.threshingData.slice(0, 10).map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {item.date ? new Date(item.date).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-xs">
                        {item.paddyType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-medium">
                      {(item.paddyQuantity || item.PaddyQuantity || 0).toLocaleString()} kg
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded-full text-xs">
                        {item.riceType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-medium">
                      {(item.riceQuantity || 0).toLocaleString()} kg
                    </td>
                    <td className="py-3 px-4 text-right text-orange-600 dark:text-orange-400 font-medium">
                      {(item.brokenRiceQuantity || 0).toLocaleString()} kg
                    </td>
                    <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400 font-medium">
                      {(item.polishRiceQuantity || 0).toLocaleString()} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Filters Section */}
      <ReportFilters
        filters={filters}
        onFilterChange={setFilters}
        onGenerateReport={handleGenerateReport}
        onExportReport={handleExportReport}
        onPrintReport={handlePrintReport}
        warehouses={warehouses}
        suppliers={suppliers}
        loading={loading}
      />

      {/* Summary Cards */}
      {reportData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10
                     border border-green-200 dark:border-green-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reportData.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10
                     border border-blue-200 dark:border-blue-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Quantity</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {reportData.reduce((sum, item) => sum + (item.quantity || item.paddyQuantity || item.riceQuantity || 0), 0).toLocaleString()} kg
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10
                     border border-purple-200 dark:border-purple-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date Range</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {filters.fromDate || 'All'} - {filters.toDate || 'Today'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Chart Section */}
      {chartData.length > 0 && (
        <GlassCard>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-6">
            {filters.reportType?.toUpperCase().includes('SALE') ? 'Sales Summary' : 'Stock Movement Summary'}
          </h3>
          <ResponsiveContainer width="100%" height={300} className="md:h-[400px]">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(46, 125, 50, 0.2)" className="dark:stroke-[rgba(255,255,255,0.1)]" />
              <XAxis dataKey="month" stroke="#2E7D32" className="dark:stroke-[#00FF88]" />
              <YAxis stroke="#2E7D32" className="dark:stroke-[#00FF88]" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid rgba(46, 125, 50, 0.3)',
                  borderRadius: '8px',
                  color: '#263238'
                }}
                className="dark:[&>div]:!bg-[rgba(26,26,46,0.9)] dark:[&>div]:!border-[rgba(0,255,136,0.3)] dark:[&>div]:!text-white"
                formatter={(value, name) => [
                  name === 'totalAmount' ? `Rs. ${value.toLocaleString()}` : `${value.toLocaleString()} kg`,
                  name === 'totalAmount' ? 'Sales Amount' : name === 'paddy' ? 'Paddy Quantity' : 'Rice Quantity'
                ]}
              />
              <Legend />
              {/* Show rice bar for rice reports and threshing reports */}
              {(filters.reportType?.toUpperCase().includes('RICE') || filters.reportType?.toUpperCase().includes('THRESHING')) && (
                <Bar dataKey="rice" fill="#2E7D32" className="dark:fill-[#00FF88]" name="Rice (kg)" radius={[4, 4, 0, 0]} />
              )}
              {/* Show paddy bar for paddy reports */}
              {filters.reportType?.toUpperCase().includes('PADDY') && !filters.reportType?.toUpperCase().includes('THRESHING') && (
                <Bar dataKey="paddy" fill="#F59E0B" className="dark:fill-[#FCD34D]" name="Paddy (kg)" radius={[4, 4, 0, 0]} />
              )}
              {/* Show total amount bar for sale reports */}
              {filters.reportType?.toUpperCase().includes('SALE') && (
                <Bar dataKey="totalAmount" fill="#8B5CF6" className="dark:fill-[#A78BFA]" name="Sales Amount (Rs.)" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* Report Table */}
      {(reportData.length > 0 || loading) && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
              Report Results
            </h3>
          </div>
          <ReportTable data={reportData} reportType={filters.reportType} loading={loading} />
        </GlassCard>
      )}
    </div>
  );
};

export default Reports;
