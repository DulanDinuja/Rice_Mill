# Backend API Development Prompt - Reports Feature

## 🎯 Project Overview

Develop RESTful APIs for the **Ameera Rice Inventory System - Reports Feature**. The system manages rice mill operations including paddy processing, rice production, inventory management, and sales tracking.

---

## 📋 Requirements Summary

Create a comprehensive reporting API that supports:
- 5 different report types (Paddy and Rice operations)
- Advanced filtering (date range, warehouse, type, supplier)
- Data aggregation for charts
- CSV/PDF export functionality
- Pagination support
- Authentication and authorization

---

## 🔧 Technical Stack Requirements

### Backend Framework (Choose One)
- **Node.js + Express.js** (Recommended)
- **Python + Django/Flask**
- **Java + Spring Boot**
- **PHP + Laravel**

### Database (Choose One)
- **PostgreSQL** (Recommended for complex queries)
- **MySQL**
- **MongoDB** (if NoSQL preferred)

### Additional Requirements
- JWT authentication
- Input validation
- Error handling middleware
- Logging system
- Rate limiting
- CORS support

---

## 📊 API Endpoints to Implement

### 1. Get Reports Data

**Endpoint:** `GET /api/reports`

**Purpose:** Fetch filtered report data based on type and criteria

**Authentication:** Required (Bearer Token)

**Query Parameters:**
```typescript
interface ReportQueryParams {
  reportType: string;        // Required: paddy_threshing | paddy_sale | paddy_add_stock | rice_sale | rice_add_stock
  fromDate?: string;         // Optional: ISO date string (YYYY-MM-DD)
  toDate?: string;           // Optional: ISO date string (YYYY-MM-DD)
  warehouse?: string;        // Optional: Warehouse name
  paddyType?: string;        // Optional: For paddy reports (Nadu | Keeri Samba | Samba)
  riceType?: string;         // Optional: For rice reports (White Raw | Steam Nadu | Steam Keeri | Red Raw | Keeri White Raw)
  supplier?: string;         // Optional: For paddy reports
  page?: number;             // Optional: Default 1
  limit?: number;            // Optional: Default 100, Max 1000
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "paddyType": "Nadu",
      "quantity": 1000,
      "unit": "kg",
      "moistureLevel": 14,
      "warehouse": "Main Warehouse",
      "supplier": "Farmer Co-op A",
      "pricePerKg": 25,
      "actionType": "Threshing",
      "date": "2025-01-15T08:00:00Z",
      "createdAt": "2025-01-15T08:00:00Z",
      "updatedAt": "2025-01-15T08:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalRecords": 50,
    "limit": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "summary": {
    "totalRecords": 50,
    "totalQuantity": 12500,
    "dateRange": {
      "from": "2025-01-01",
      "to": "2025-02-02"
    }
  }
}
```

**Error Responses:**
```json
// 400 Bad Request - Invalid report type
{
  "success": false,
  "error": "Invalid report type",
  "code": "INVALID_REPORT_TYPE",
  "validTypes": ["paddy_threshing", "paddy_sale", "paddy_add_stock", "rice_sale", "rice_add_stock"]
}

// 400 Bad Request - Invalid date range
{
  "success": false,
  "error": "From date must be earlier than to date",
  "code": "INVALID_DATE_RANGE"
}

// 401 Unauthorized
{
  "success": false,
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}

// 500 Internal Server Error
{
  "success": false,
  "error": "Internal server error",
  "code": "SERVER_ERROR"
}
```

**Business Logic:**
1. Validate authentication token
2. Validate report type against allowed values
3. Validate date range (fromDate <= toDate)
4. Build dynamic SQL query based on report type
5. Apply filters (date, warehouse, type, supplier)
6. Order by date DESC
7. Apply pagination
8. Calculate summary statistics
9. Return formatted response

---

### 2. Get Chart Data

**Endpoint:** `GET /api/reports/chart`

**Purpose:** Get aggregated data for chart visualization

**Authentication:** Required

**Query Parameters:**
```typescript
interface ChartQueryParams {
  reportType: string;        // Required
  fromDate?: string;         // Optional
  toDate?: string;           // Optional
  warehouse?: string;        // Optional
  paddyType?: string;        // Optional
  riceType?: string;         // Optional
  supplier?: string;         // Optional
  groupBy?: string;          // Optional: 'day' | 'week' | 'month' (default: 'month')
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "period": "2025-01",
      "label": "Jan",
      "rice": 4000,
      "paddy": 2400,
      "quantity": 6400,
      "recordCount": 15
    },
    {
      "period": "2025-02",
      "label": "Feb",
      "rice": 3000,
      "paddy": 1800,
      "quantity": 4800,
      "recordCount": 12
    }
  ],
  "summary": {
    "totalQuantity": 11200,
    "averagePerPeriod": 5600,
    "periods": 2
  }
}
```

**Business Logic:**
1. Same validation as Get Reports
2. Group data by specified period (day/week/month)
3. Aggregate quantities per period
4. Separate rice and paddy quantities
5. Return formatted chart data

---

### 3. Export Report

**Endpoint:** `POST /api/reports/export`

**Purpose:** Export report data to CSV or PDF format

**Authentication:** Required

**Request Body:**
```json
{
  "reportType": "paddy_sale",
  "format": "csv",              // 'csv' or 'pdf'
  "fromDate": "2025-01-01",
  "toDate": "2025-02-02",
  "filters": {
    "warehouse": "Main Warehouse",
    "paddyType": "Nadu",
    "supplier": "Farmer Co-op A"
  },
  "options": {
    "includeChart": true,       // For PDF only
    "includeSummary": true,
    "fileName": "Custom_Report_Name"
  }
}
```

**Success Response (200):**
```
Content-Type: text/csv (for CSV)
Content-Type: application/pdf (for PDF)
Content-Disposition: attachment; filename="Paddy_Sale_Report_2025-02-02.csv"

[File content as stream/blob]
```

**Business Logic:**
1. Validate request
2. Fetch report data (same as Get Reports)
3. Generate file based on format:
   - **CSV:** Create CSV with headers and data rows
   - **PDF:** Generate PDF with title, summary, table, and optional chart
4. Set appropriate headers
5. Stream file to client

**CSV Format Example:**
```csv
Paddy Sale Report
Generated: 2025-02-02 10:30:00
Date Range: 2025-01-01 to 2025-02-02
Total Records: 50

Paddy Type,Quantity,Unit,Moisture %,Warehouse,Supplier,Action Type,Date
Nadu,1000,kg,14,Main Warehouse,Farmer Co-op A,Sale,2025-01-15
Keeri Samba,750,kg,12,Warehouse B,Farmer Co-op B,Sale,2025-01-20
```

---

### 4. Get Warehouses List

**Endpoint:** `GET /api/warehouses`

**Purpose:** Get list of all active warehouses

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Main Warehouse",
      "location": "Mumbai",
      "capacity": 10000,
      "currentStock": 7500,
      "active": true
    },
    {
      "id": 2,
      "name": "Warehouse B",
      "location": "Delhi",
      "capacity": 8000,
      "currentStock": 4300,
      "active": true
    }
  ]
}
```

---

### 5. Get Suppliers List

**Endpoint:** `GET /api/suppliers`

**Purpose:** Get list of all active suppliers

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Farmer Co-op A",
      "contactNumber": "+91 1234567890",
      "email": "contact@farmercoop-a.com",
      "address": "Village XYZ",
      "active": true
    }
  ]
}
```

---

### 6. Get Report Types

**Endpoint:** `GET /api/reports/types`

**Purpose:** Get available report types with metadata

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "value": "paddy_threshing",
      "label": "Paddy Threshing Report",
      "category": "paddy",
      "description": "All threshing operations with moisture levels",
      "columns": ["paddyType", "quantity", "moistureLevel", "warehouse", "supplier", "actionType", "date"]
    },
    {
      "value": "paddy_sale",
      "label": "Paddy Sale Report",
      "category": "paddy",
      "description": "Paddy sales transactions",
      "columns": ["paddyType", "quantity", "moistureLevel", "warehouse", "supplier", "pricePerKg", "actionType", "date"]
    }
  ]
}
```

---

## 🗄️ Database Schema

### Table: reports_data

**Purpose:** Store all report-related transactions

```sql
CREATE TABLE reports_data (
    id SERIAL PRIMARY KEY,
    report_type VARCHAR(50) NOT NULL,
    
    -- Item details
    item_type VARCHAR(100),           -- paddy_type or rice_type
    grade VARCHAR(10),                -- For rice only
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) DEFAULT 'kg',
    
    -- Paddy specific
    moisture_level DECIMAL(5, 2),     -- Percentage
    supplier_id INT,
    supplier_name VARCHAR(100),
    
    -- Location
    warehouse_id INT,
    warehouse_name VARCHAR(100),
    
    -- Pricing
    price_per_kg DECIMAL(10, 2),
    total_price DECIMAL(12, 2),
    
    -- Transaction details
    action_type VARCHAR(50),          -- Threshing, Sale, Add Stock
    transaction_date TIMESTAMP NOT NULL,
    
    -- Metadata
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,             -- Soft delete
    
    -- Indexes for performance
    INDEX idx_report_type (report_type),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_warehouse (warehouse_id, warehouse_name),
    INDEX idx_item_type (item_type),
    INDEX idx_composite (report_type, transaction_date, warehouse_id),
    
    -- Foreign keys
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Table: warehouses

```sql
CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    location VARCHAR(200),
    capacity DECIMAL(12, 2),          -- Total capacity in kg
    current_stock DECIMAL(12, 2) DEFAULT 0,
    temperature DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_active (active),
    INDEX idx_name (name)
);
```

### Table: suppliers

```sql
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_active (active),
    INDEX idx_name (name)
);
```

---

## 🔐 Authentication & Authorization

### JWT Token Structure
```json
{
  "userId": 123,
  "username": "admin",
  "role": "admin",
  "permissions": ["reports:read", "reports:export"],
  "iat": 1675334400,
  "exp": 1675420800
}
```

### Permission Levels
- `reports:read` - View reports
- `reports:export` - Export reports
- `reports:admin` - Full access

### Implementation
```javascript
// Middleware example (Node.js)
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      code: 'UNAUTHORIZED'
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token',
        code: 'FORBIDDEN'
      });
    }
    req.user = user;
    next();
  });
};
```

---

## 🎯 Business Logic Implementation

### 1. Report Type Query Builder

```javascript
// Pseudo-code for building dynamic queries

function buildReportQuery(reportType, filters) {
  let baseQuery = '';
  let whereConditions = [];
  let params = [];
  
  switch(reportType) {
    case 'paddy_threshing':
      baseQuery = 'SELECT * FROM reports_data WHERE action_type = ?';
      params.push('Threshing');
      whereConditions.push('report_type LIKE ?');
      params.push('paddy%');
      break;
      
    case 'paddy_sale':
      baseQuery = 'SELECT * FROM reports_data WHERE action_type = ?';
      params.push('Sale');
      whereConditions.push('report_type LIKE ?');
      params.push('paddy%');
      break;
      
    case 'rice_sale':
      baseQuery = 'SELECT * FROM reports_data WHERE action_type = ?';
      params.push('Sale');
      whereConditions.push('report_type LIKE ?');
      params.push('rice%');
      break;
      
    // ... other cases
  }
  
  // Add date filters
  if (filters.fromDate) {
    whereConditions.push('transaction_date >= ?');
    params.push(filters.fromDate);
  }
  
  if (filters.toDate) {
    whereConditions.push('transaction_date <= ?');
    params.push(filters.toDate);
  }
  
  // Add optional filters
  if (filters.warehouse) {
    whereConditions.push('warehouse_name = ?');
    params.push(filters.warehouse);
  }
  
  if (filters.paddyType) {
    whereConditions.push('item_type = ?');
    params.push(filters.paddyType);
  }
  
  // Build final query
  const finalQuery = baseQuery + 
    (whereConditions.length ? ' AND ' + whereConditions.join(' AND ') : '') +
    ' ORDER BY transaction_date DESC' +
    ' LIMIT ? OFFSET ?';
  
  return { query: finalQuery, params };
}
```

### 2. Summary Calculation

```javascript
function calculateSummary(data) {
  return {
    totalRecords: data.length,
    totalQuantity: data.reduce((sum, item) => sum + item.quantity, 0),
    averageQuantity: data.length > 0 
      ? data.reduce((sum, item) => sum + item.quantity, 0) / data.length 
      : 0,
    dateRange: {
      from: data.length > 0 ? data[data.length - 1].date : null,
      to: data.length > 0 ? data[0].date : null
    }
  };
}
```

### 3. Chart Data Aggregation

```javascript
function aggregateChartData(data, groupBy = 'month') {
  const grouped = {};
  
  data.forEach(item => {
    const date = new Date(item.date);
    let key;
    
    if (groupBy === 'day') {
      key = date.toISOString().split('T')[0];
    } else if (groupBy === 'month') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    
    if (!grouped[key]) {
      grouped[key] = {
        period: key,
        label: formatLabel(date, groupBy),
        rice: 0,
        paddy: 0,
        quantity: 0,
        recordCount: 0
      };
    }
    
    grouped[key].quantity += item.quantity;
    grouped[key].recordCount += 1;
    
    if (item.report_type.includes('rice')) {
      grouped[key].rice += item.quantity;
    } else {
      grouped[key].paddy += item.quantity;
    }
  });
  
  return Object.values(grouped).sort((a, b) => 
    a.period.localeCompare(b.period)
  );
}
```

---

## ✅ Validation Rules

### Input Validation

```javascript
const reportValidation = {
  reportType: {
    required: true,
    enum: ['paddy_threshing', 'paddy_sale', 'paddy_add_stock', 'rice_sale', 'rice_add_stock']
  },
  fromDate: {
    type: 'date',
    format: 'YYYY-MM-DD'
  },
  toDate: {
    type: 'date',
    format: 'YYYY-MM-DD',
    customValidation: (value, data) => {
      if (data.fromDate && value < data.fromDate) {
        throw new Error('To date must be after from date');
      }
    }
  },
  page: {
    type: 'integer',
    min: 1
  },
  limit: {
    type: 'integer',
    min: 1,
    max: 1000
  }
};
```

---

## 🚀 Performance Optimization

### 1. Database Indexing
```sql
-- Composite index for common queries
CREATE INDEX idx_report_composite 
ON reports_data(report_type, transaction_date, warehouse_id);

-- Partial index for active records
CREATE INDEX idx_active_reports 
ON reports_data(transaction_date) 
WHERE deleted_at IS NULL;
```

### 2. Query Optimization
- Use prepared statements
- Implement connection pooling
- Use EXPLAIN ANALYZE for slow queries
- Add query result caching (Redis)

### 3. Caching Strategy
```javascript
// Cache warehouse and supplier lists (1 hour TTL)
cache.set('warehouses:list', data, 3600);

// Cache common report queries (5 minutes TTL)
cache.set(`report:${reportType}:${dateHash}`, data, 300);
```

### 4. Pagination
- Use cursor-based pagination for large datasets
- Limit default to 100 records
- Maximum 1000 records per request

---

## 🔍 Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "fieldName",
    "value": "invalidValue",
    "constraint": "validation rule"
  },
  "timestamp": "2025-02-02T10:30:00Z"
}
```

### Error Codes
- `INVALID_REPORT_TYPE` - Invalid report type provided
- `INVALID_DATE_RANGE` - Date range validation failed
- `MISSING_REQUIRED_FIELD` - Required field not provided
- `UNAUTHORIZED` - Authentication failed
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `SERVER_ERROR` - Internal server error
- `DATABASE_ERROR` - Database operation failed

---

## 📝 Logging Requirements

### Log Format
```json
{
  "timestamp": "2025-02-02T10:30:00Z",
  "level": "info",
  "endpoint": "/api/reports",
  "method": "GET",
  "userId": 123,
  "requestId": "uuid-here",
  "duration": 150,
  "status": 200,
  "params": {
    "reportType": "paddy_sale",
    "fromDate": "2025-01-01"
  }
}
```

### What to Log
- All API requests/responses
- Authentication attempts
- Export operations
- Database errors
- Performance metrics

---

## 🧪 Testing Requirements

### Unit Tests
- [ ] Report type validation
- [ ] Date range validation
- [ ] Query builder logic
- [ ] Summary calculations
- [ ] Chart data aggregation

### Integration Tests
- [ ] GET /api/reports with all filter combinations
- [ ] POST /api/reports/export (CSV and PDF)
- [ ] Authentication middleware
- [ ] Error handling

### Load Tests
- [ ] 100 concurrent requests
- [ ] Response time < 500ms for simple queries
- [ ] Response time < 2s for complex aggregations

---

## 📦 Deliverables Checklist

### Code
- [ ] All 6 API endpoints implemented
- [ ] Database migrations
- [ ] Seed data for testing
- [ ] Authentication middleware
- [ ] Validation middleware
- [ ] Error handling middleware

### Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Database schema documentation
- [ ] Setup instructions
- [ ] Environment variables documentation
- [ ] Example requests/responses

### Testing
- [ ] Unit test coverage > 80%
- [ ] Integration tests passing
- [ ] Postman collection
- [ ] Load test results

---

## 🌐 CORS Configuration

```javascript
const corsOptions = {
  origin: ['http://localhost:5173', 'https://yourdomain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
};
```

---

## 🔒 Security Best Practices

1. **Input Sanitization**
   - Sanitize all user inputs
   - Use parameterized queries
   - Validate data types

2. **Rate Limiting**
   - 100 requests per 15 minutes per user
   - 10 export requests per hour per user

3. **SQL Injection Prevention**
   - Use ORM or prepared statements
   - Never concatenate SQL strings

4. **Authentication**
   - JWT with expiration
   - Refresh token mechanism
   - Password hashing (bcrypt)

5. **HTTPS Only**
   - Force HTTPS in production
   - Secure cookie flags

---

## 📊 Sample Data for Testing

### Insert Sample Reports Data
```sql
INSERT INTO reports_data (report_type, item_type, quantity, moisture_level, warehouse_name, supplier_name, action_type, transaction_date) VALUES
('paddy_threshing', 'Nadu', 1000, 14, 'Main Warehouse', 'Farmer Co-op A', 'Threshing', '2025-01-15 08:00:00'),
('paddy_sale', 'Keeri Samba', 750, 12, 'Warehouse B', 'Farmer Co-op B', 'Sale', '2025-01-20 10:30:00'),
('rice_sale', 'Basmati', 500, NULL, 'Main Warehouse', NULL, 'Sale', '2025-01-25 14:00:00');
```

---

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Health check endpoint working
- [ ] Backup strategy in place
- [ ] Monitoring tools set up

---

## 📞 Support & Maintenance

### Health Check Endpoint
```
GET /api/health

Response:
{
  "status": "healthy",
  "timestamp": "2025-02-02T10:30:00Z",
  "database": "connected",
  "uptime": 86400
}
```

---

## 🎓 Example Implementation (Node.js + Express)

### Basic Server Structure
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use('/api/reports', authenticateToken, reportsRouter);
app.use('/api/warehouses', authenticateToken, warehousesRouter);
app.use('/api/suppliers', authenticateToken, suppliersRouter);

// Error handler
app.use(errorHandler);

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
```

---

## ✅ Acceptance Criteria

The implementation is complete when:

1. ✅ All 6 endpoints are functional
2. ✅ Database schema is created and populated
3. ✅ Authentication works correctly
4. ✅ All filters apply correctly
5. ✅ CSV export works
6. ✅ PDF export works
7. ✅ Pagination works
8. ✅ Error handling is robust
9. ✅ API documentation is complete
10. ✅ Tests pass with > 80% coverage

---

## 📖 Additional Resources

- **API Documentation:** Use Swagger/OpenAPI
- **Database Design:** PostgreSQL documentation
- **Authentication:** JWT.io documentation
- **File Export:** Libraries like csv-writer, pdfkit
- **Testing:** Jest, Mocha, or Pytest

---

**Good luck with the implementation! 🚀**

If you need clarification on any endpoint or requirement, refer back to this document or the frontend implementation in the React codebase.

---

**Prompt Version:** 1.0
**Created:** February 2, 2026
**Status:** Ready for Development ✅
