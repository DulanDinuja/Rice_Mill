import { stockService } from './api/stockService';

const generateCSV = (data, type) => {
  if (!data || data.length === 0) return '';
  
  const headers = type === 'rice' 
    ? ['Rice Type', 'Quantity', 'Unit', 'Warehouse', 'Grade', 'Price/kg', 'Status', 'Last Updated']
    : ['Paddy Type', 'Quantity', 'Unit', 'Warehouse', 'Moisture %', 'Supplier', 'Price/kg', 'Status'];
  
  const rows = data.map(item => {
    if (type === 'rice') {
      return [
        item.riceType,
        item.quantity,
        item.unit,
        item.warehouse,
        item.grade,
        item.pricePerKg,
        item.status,
        new Date(item.lastUpdated).toLocaleDateString()
      ];
    } else {
      return [
        item.paddyType,
        item.quantity,
        item.unit,
        item.warehouse,
        item.moistureLevel,
        item.supplier,
        item.pricePerKg,
        item.status
      ];
    }
  });
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

const generateHTML = (data, type, title) => {
  const headers = type === 'rice' 
    ? ['Rice Type', 'Quantity', 'Unit', 'Warehouse', 'Grade', 'Price/kg', 'Status', 'Last Updated']
    : ['Paddy Type', 'Quantity', 'Unit', 'Warehouse', 'Moisture %', 'Supplier', 'Price/kg', 'Status'];
  
  const tableRows = data.map(item => {
    const cells = type === 'rice' 
      ? [
          item.riceType,
          item.quantity,
          item.unit,
          item.warehouse,
          item.grade,
          `Rs. ${item.pricePerKg}`,
          item.status,
          new Date(item.lastUpdated).toLocaleDateString()
        ]
      : [
          item.paddyType,
          item.quantity,
          item.unit,
          item.warehouse,
          `${item.moistureLevel}%`,
          item.supplier,
          `Rs. ${item.pricePerKg}`,
          item.status
        ];
    
    return `<tr>${cells.map(cell => `<td style="padding: 8px; border: 1px solid #ddd;">${cell}</td>`).join('')}</tr>`;
  }).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title} Export</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th { background-color: #f5f5f5; padding: 10px; border: 1px solid #ddd; text-align: left; }
        td { padding: 8px; border: 1px solid #ddd; }
        .export-info { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .print-btn { background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px 5px; }
        .download-btn { background-color: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="export-info">
        <h1>${title} Export Report</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Total Records:</strong> ${data.length}</p>
        <button class="print-btn" onclick="window.print()">Print Report</button>
        <button class="download-btn" onclick="downloadCSV()">Download CSV</button>
      </div>
      
      <table>
        <thead>
          <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      
      <script>
        function downloadCSV() {
          const csvData = \`${generateCSV(data, type).replace(/`/g, '\\`')}\`;
          const blob = new Blob([csvData], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = '${title.toLowerCase().replace(' ', '-')}-export-${Date.now()}.csv';
          a.click();
          window.URL.revokeObjectURL(url);
        }
      </script>
    </body>
    </html>
  `;
};

export const exportService = {
  exportRiceStock: async (options) => {
    try {
      const { format, dateRange } = options;
      
      // Get rice stock data
      const response = await stockService.getRiceStocks();
      let data = response.data || [];
      
      // Filter by date range if needed
      if (dateRange !== 'all') {
        const now = new Date();
        const filterDate = new Date();
        
        switch (dateRange) {
          case 'today':
            filterDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            filterDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            filterDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            filterDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        data = data.filter(item => new Date(item.lastUpdated) >= filterDate);
      }
      
      if (format === 'csv') {
        const csvContent = generateCSV(data, 'rice');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const filename = `rice-stock-${dateRange}-${Date.now()}.csv`;
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // Open HTML preview in new window
        const htmlContent = generateHTML(data, 'rice', 'Rice Stock');
        const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        
        if (newWindow) {
          newWindow.document.write(htmlContent);
          newWindow.document.close();
          newWindow.focus();
        }
      }
    } catch (error) {
      console.error('Rice stock export failed:', error);
      throw error;
    }
  },

  exportPaddyStock: async (options) => {
    try {
      const { format, dateRange } = options;
      
      // Get paddy stock data
      const response = await stockService.getPaddyStocks();
      let data = response.data || [];
      
      // Filter by date range if needed (assuming paddy has dateAdded field)
      if (dateRange !== 'all' && data.length > 0 && data[0].dateAdded) {
        const now = new Date();
        const filterDate = new Date();
        
        switch (dateRange) {
          case 'today':
            filterDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            filterDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            filterDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            filterDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        data = data.filter(item => new Date(item.dateAdded) >= filterDate);
      }
      
      if (format === 'csv') {
        const csvContent = generateCSV(data, 'paddy');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const filename = `paddy-stock-${dateRange}-${Date.now()}.csv`;
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // Open HTML preview in new window
        const htmlContent = generateHTML(data, 'paddy', 'Paddy Stock');
        const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        
        if (newWindow) {
          newWindow.document.write(htmlContent);
          newWindow.document.close();
          newWindow.focus();
        }
      }
    } catch (error) {
      console.error('Paddy stock export failed:', error);
      throw error;
    }
  }
};