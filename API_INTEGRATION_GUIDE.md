# Reports API Integration Guide

## Overview
This document describes how to integrate the Reports feature with a real backend API.

---

## Current Implementation

Currently, the system uses **localStorage** with mock data. To connect to a real backend:

1. Update the `USE_MOCK` flag in services
2. Implement the API endpoints described below
3. Update error handling as needed

---

## Required API Endpoints

### 1. Get Reports Data

**Endpoint:** `GET /api/reports`

**Query Parameters:**
```javascript
{
  fromDate: "2025-01-01",      // Optional, ISO date string
  toDate: "2025-02-02",         // Optional, ISO date string
  reportType: "paddy_sale",     // Required, one of report types below
  warehouse: "Main Warehouse",  // Optional
  paddyType: "Nadu",            // Optional, for paddy reports
  riceType: "Basmati",          // Optional, for rice reports
  supplier: "Farmer Co-op A"    // Optional, for paddy reports
}
```

**Report Types:**
- `paddy_threshing`
- `paddy_sale`
- `paddy_add_stock`
- `rice_sale`
- `rice_add_stock`

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "paddyType": "Nadu",
      "quantity": 1000,
      "moistureLevel": 14,
      "warehouse": "Main Warehouse",
      "supplier": "Farmer Co-op A",
      "actionType": "Threshing",
      "date": "2025-01-15T08:00:00Z"
    },
    // ... more records
  ],
  "total": 50,
  "page": 1,
  "limit": 100
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid report type",
  "code": "INVALID_REPORT_TYPE"
}
```

---

### 2. Get Warehouses List

**Endpoint:** `GET /api/warehouses`

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Main Warehouse",
      "location": "Mumbai",
      "active": true
    },
    // ... more warehouses
  ]
}
```

---

### 3. Get Suppliers List

**Endpoint:** `GET /api/suppliers`

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Farmer Co-op A",
      "contactNumber": "+91 1234567890",
      "active": true
    },
    // ... more suppliers
  ]
}
```

---

### 4. Export Report

**Endpoint:** `POST /api/reports/export`

**Request Body:**
```json
{
  "fromDate": "2025-01-01",
  "toDate": "2025-02-02",
  "reportType": "paddy_sale",
  "format": "csv",  // or "pdf", "xlsx"
  "filters": {
    "warehouse": "Main Warehouse",
    "paddyType": "Nadu"
  }
}
```

**Response:**
- File download (Content-Type: text/csv or application/pdf)
- Or URL to download file

---

## Data Models

### Paddy Report Data Model

```typescript
interface PaddyReportItem {
  id: number;
  paddyType: string;
  quantity: number;
  unit: string;
  moistureLevel: number;  // percentage
  warehouse: string;
  supplier: string;
  pricePerKg?: number;
  actionType: 'Threshing' | 'Sale' | 'Add Stock';
  date: string;  // ISO date string
  createdAt: string;
  updatedAt: string;
}
```

### Rice Report Data Model

```typescript
interface RiceReportItem {
  id: number;
  riceType: string;
  grade: string;
  quantity: number;
  unit: string;
  warehouse: string;
  pricePerKg: number;
  actionType: 'Sale' | 'Add Stock';
  date: string;  // ISO date string
  createdAt: string;
  updatedAt: string;
}
```

---

## Implementation Steps

### Step 1: Update axiosConfig.js

```javascript
// src/services/api/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
```

---

### Step 2: Update reportsService.js

```javascript
// src/services/reportsService.js

import axiosInstance from './api/axiosConfig';

const USE_MOCK = false;  // Change to false for API

export const reportsService = {
  getReports: async (fromDate, toDate, reportType, filters = {}) => {
    if (USE_MOCK) {
      // ... existing mock code
    }

    try {
      const params = {
        fromDate,
        toDate,
        reportType,
        ...filters
      };

      const response = await axiosInstance.get('/reports', { params });
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch reports'
      };
    }
  },

  getWarehouses: async () => {
    if (USE_MOCK) {
      // ... existing mock code
    }

    try {
      const response = await axiosInstance.get('/warehouses');
      return response.data.data.map(w => w.name);
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  getSuppliers: async () => {
    if (USE_MOCK) {
      // ... existing mock code
    }

    try {
      const response = await axiosInstance.get('/suppliers');
      return response.data.data.map(s => s.name);
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  exportReport: async (fromDate, toDate, reportType, format, filters) => {
    try {
      const response = await axiosInstance.post('/reports/export', {
        fromDate,
        toDate,
        reportType,
        format,
        filters
      }, {
        responseType: 'blob'  // Important for file downloads
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { success: true };
    } catch (error) {
      console.error('Export Error:', error);
      return { 
        success: false, 
        error: 'Failed to export report' 
      };
    }
  }
};
```

---

### Step 3: Update Reports.jsx

```javascript
// src/pages/Reports.jsx

// Update the useEffect to fetch warehouses and suppliers from API
useEffect(() => {
  const fetchFilters = async () => {
    const warehousesList = await reportsService.getWarehouses();
    const suppliersList = await reportsService.getSuppliers();
    setWarehouses(warehousesList);
    setSuppliers(suppliersList);
  };
  
  fetchFilters();
}, []);

// Update export handler to use API
const handleExportReport = async () => {
  if (!filters.reportType || reportData.length === 0) {
    alert('Please generate a report first');
    return;
  }

  const result = await reportsService.exportReport(
    filters.fromDate,
    filters.toDate,
    filters.reportType,
    'csv',  // or 'pdf', 'xlsx'
    {
      warehouse: filters.warehouse,
      paddyType: filters.paddyType,
      riceType: filters.riceType,
      supplier: filters.supplier
    }
  );

  if (!result.success) {
    alert('Failed to export report: ' + result.error);
  }
};
```

---

## Environment Variables

Create `.env` file in project root:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_USE_MOCK=false
```

---

## Backend Requirements

### Database Schema

**reports_data table:**
```sql
CREATE TABLE reports_data (
  id SERIAL PRIMARY KEY,
  report_type VARCHAR(50) NOT NULL,
  item_type VARCHAR(50),  -- paddy_type or rice_type
  grade VARCHAR(10),
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(20) DEFAULT 'kg',
  moisture_level DECIMAL(5, 2),
  warehouse VARCHAR(100),
  supplier VARCHAR(100),
  price_per_kg DECIMAL(10, 2),
  action_type VARCHAR(50),
  date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_report_type (report_type),
  INDEX idx_date (date),
  INDEX idx_warehouse (warehouse)
);
```

---

## Error Handling

### Common Errors

1. **Invalid Date Range**
```json
{
  "success": false,
  "error": "From date must be earlier than to date",
  "code": "INVALID_DATE_RANGE"
}
```

2. **Missing Report Type**
```json
{
  "success": false,
  "error": "Report type is required",
  "code": "MISSING_REPORT_TYPE"
}
```

3. **No Data Found**
```json
{
  "success": true,
  "data": [],
  "message": "No records found for the selected filters"
}
```

4. **Unauthorized**
```json
{
  "success": false,
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

---

## Performance Optimization

### Backend Recommendations

1. **Indexing**
   - Index on date field
   - Index on report_type
   - Composite index on (report_type, date)

2. **Pagination**
   - Limit 100 records per request
   - Implement cursor-based pagination for large datasets

3. **Caching**
   - Cache warehouse and supplier lists (TTL: 1 hour)
   - Cache report data for common queries (TTL: 5 minutes)

4. **Query Optimization**
   - Use prepared statements
   - Optimize date range queries
   - Implement database connection pooling

---

## Testing

### API Testing with Postman

**Get Reports:**
```
GET http://localhost:8080/api/reports?fromDate=2025-01-01&toDate=2025-02-02&reportType=paddy_sale
```

**Get Warehouses:**
```
GET http://localhost:8080/api/warehouses
```

**Export Report:**
```
POST http://localhost:8080/api/reports/export
Content-Type: application/json

{
  "fromDate": "2025-01-01",
  "toDate": "2025-02-02",
  "reportType": "paddy_sale",
  "format": "csv"
}
```

---

## Security Considerations

1. **Authentication**
   - Require valid JWT token
   - Implement role-based access control

2. **Input Validation**
   - Validate date formats
   - Sanitize filter inputs
   - Check report type against allowed values

3. **Rate Limiting**
   - Limit API calls per user
   - Implement throttling for export endpoints

4. **Data Privacy**
   - Filter data based on user permissions
   - Log all report access
   - Implement data masking for sensitive fields

---

## Migration Checklist

- [ ] Set up backend API endpoints
- [ ] Create database tables
- [ ] Implement authentication
- [ ] Add input validation
- [ ] Set up error handling
- [ ] Configure CORS
- [ ] Test all endpoints
- [ ] Update frontend services
- [ ] Change USE_MOCK to false
- [ ] Add environment variables
- [ ] Deploy and test
- [ ] Monitor performance

---

## Support

For backend integration issues:
1. Check API endpoint URLs
2. Verify authentication tokens
3. Review CORS configuration
4. Check network requests in browser DevTools
5. Review backend logs

---

## Next Steps

1. **Phase 1:** Set up basic GET endpoints
2. **Phase 2:** Implement filtering and pagination
3. **Phase 3:** Add export functionality
4. **Phase 4:** Optimize performance
5. **Phase 5:** Add analytics and insights

Good luck with the API integration! 🚀
