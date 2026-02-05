# Rice Stock Add API Integration

## Overview
This document describes the implementation of the Rice Stock Add functionality that integrates with the backend API endpoint.

## Feature Description
The Rice Stock page includes an "Add Stock" button that opens a modal form. When the user fills out the form and submits it, the data is sent to the backend API to add a new rice stock entry.

---

## Implementation Details

### Frontend Components

#### 1. RiceStock Page (`src/pages/RiceStock.jsx`)
- **Location**: Line 94-97
- **Button**: "Add Stock" button that triggers the modal
- **Functionality**: Opens the `AddStockModal` component when clicked

```jsx
<NeonButton onClick={() => setIsAddModalOpen(true)} className="font-black flex-1 sm:flex-none">
  <Plus size={20} />
  <span className="hidden sm:inline">Add Stock</span>
</NeonButton>
```

#### 2. AddStockModal Component (`src/components/modals/AddStockModal.jsx`)
The modal contains a comprehensive form with the following fields:

**Required Fields:**
- `riceType` - Type of rice (dropdown with predefined options)
- `quantity` - Quantity of rice (number input)
- `warehouse` - Warehouse name (text input)
- `pricePerKg` - Price per kilogram (number input)

**Optional Fields:**
- `unit` - Unit of measurement (dropdown, default: 'kg')
- `grade` - Rice grade (dropdown, default: 'A')
- `customerName` - Customer name (text input)
- `customerId` - Customer ID (text input)
- `mobileNumber` - Mobile number (tel input)
- `status` - Stock status (automatically set to 'In Stock')

**Enhanced Features:**
- Loading state during submission
- Error handling and display
- Form validation
- Automatic form reset after successful submission
- Responsive design for mobile and desktop

---

## API Integration

### Endpoint Configuration

**Base URL**: `http://localhost:8080/api`  
**Endpoint**: `POST /v1/rice-stock/add`  
**Full URL**: `http://localhost:8080/api/v1/rice-stock/add`

### Service Implementation (`src/services/api/stockService.js`)

```javascript
addRiceStock: async (stockData) => {
  if (USE_MOCK) {
    // Mock implementation for development
    const stocks = localStorageService.getRiceStocks();
    const newStock = {
      id: Date.now(),
      ...stockData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: 'In Stock'
    };
    stocks.push(newStock);
    localStorageService.saveRiceStocks(stocks);
    return { data: newStock };
  }
  return axiosInstance.post('/v1/rice-stock/add', stockData);
}
```

---

## Request/Response Format

### Request Body
```json
{
  "riceType": "White Raw",
  "quantity": "1000",
  "unit": "kg",
  "warehouse": "Main Warehouse",
  "grade": "A",
  "pricePerKg": "45.50",
  "customerName": "John Doe",
  "customerId": "CUST001",
  "mobileNumber": "+1234567890",
  "status": "In Stock"
}
```

### Expected Success Response
```json
{
  "data": {
    "id": 1,
    "riceType": "White Raw",
    "quantity": "1000",
    "unit": "kg",
    "warehouse": "Main Warehouse",
    "grade": "A",
    "pricePerKg": "45.50",
    "customerName": "John Doe",
    "customerId": "CUST001",
    "mobileNumber": "+1234567890",
    "status": "In Stock",
    "createdAt": "2024-02-05T10:30:00.000Z",
    "updatedAt": "2024-02-05T10:30:00.000Z",
    "lastUpdated": "2024-02-05T10:30:00.000Z"
  }
}
```

### Expected Error Response
```json
{
  "message": "Error description",
  "error": "Error code or details"
}
```

---

## Usage Instructions

### For Development (Mock Mode)
1. The application currently runs in **mock mode** (`USE_MOCK = true`)
2. Data is stored in browser's `localStorage`
3. No backend API is required
4. To test:
   - Navigate to the Rice Stock page
   - Click the "Add Stock" button
   - Fill in the form fields
   - Click "Add Stock" to submit
   - The new stock will appear in the table

### For Production (API Mode)

To switch to using the real backend API:

1. **Update the USE_MOCK flag** in `src/services/api/stockService.js`:
   ```javascript
   const USE_MOCK = false;
   ```

2. **Ensure the backend API is running** at `http://localhost:8080`

3. **Verify the API endpoint** implements the expected contract:
   - Method: `POST`
   - Path: `/api/v1/rice-stock/add`
   - Accepts: JSON request body
   - Returns: JSON response with created stock data

4. **Authentication**: The request will automatically include JWT token if available:
   - Token is retrieved from `localStorage.getItem('access_token')`
   - Sent as: `Authorization: Bearer <token>`

---

## Error Handling

The modal includes comprehensive error handling:

1. **Network Errors**: Displays a user-friendly error message
2. **API Errors**: Shows the error message from the API response
3. **Form Validation**: HTML5 validation for required fields
4. **Loading State**: Disables form during submission to prevent double-submission

### Error Display
Errors are displayed in a prominent alert at the top of the form:
```jsx
{error && (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
    <p className="text-sm">{error}</p>
  </div>
)}
```

---

## Form Validation

### Client-Side Validation
- **Required fields**: riceType, quantity, warehouse, pricePerKg
- **Type validation**: 
  - quantity and pricePerKg must be valid numbers
  - pricePerKg accepts decimals (step="0.01")
  - mobileNumber is a tel input type

### Backend Validation (Recommended)
The backend should validate:
- All required fields are present
- Numeric values are within acceptable ranges
- String lengths are within limits
- Customer ID uniqueness (if applicable)
- Mobile number format (if applicable)

---

## Constants and Configuration

### Rice Types (`src/utils/constants.js`)
```javascript
export const RICE_TYPES = [
  'White Raw',
  'Steam Nadu',
  'Steam Keeri',
  'Red Raw',
  'Keeri White Raw'
];
```

### Units
```javascript
export const UNITS = ['kg', 'ton', 'quintal', 'bags'];
```

### Grades
```javascript
export const GRADES = ['A+', 'A', 'B+', 'B', 'C'];
```

---

## Testing

### Manual Testing Checklist
- [ ] Click "Add Stock" button opens modal
- [ ] All form fields are visible and editable
- [ ] Required field validation works
- [ ] Form submits successfully with valid data
- [ ] Loading state shows during submission
- [ ] Success: Modal closes and new stock appears in table
- [ ] Error: Error message displays appropriately
- [ ] Cancel button closes modal without saving
- [ ] Form resets after successful submission
- [ ] Responsive design works on mobile and desktop

### API Testing
Test the endpoint using curl or Postman:

```bash
curl -X POST http://localhost:8080/api/v1/rice-stock/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "riceType": "White Raw",
    "quantity": "1000",
    "unit": "kg",
    "warehouse": "Main Warehouse",
    "grade": "A",
    "pricePerKg": "45.50",
    "customerName": "John Doe",
    "customerId": "CUST001",
    "mobileNumber": "+1234567890",
    "status": "In Stock"
  }'
```

---

## Security Considerations

1. **Authentication**: JWT token is automatically included in requests
2. **Authorization**: Backend should verify user permissions
3. **Input Sanitization**: Backend must sanitize all input data
4. **XSS Prevention**: React automatically escapes values
5. **CSRF Protection**: Consider implementing CSRF tokens for POST requests

---

## Troubleshooting

### Common Issues

**Issue**: Modal doesn't open
- **Solution**: Check browser console for errors, verify button click handler

**Issue**: Form submission fails
- **Solution**: 
  1. Check if backend API is running
  2. Verify API endpoint URL is correct
  3. Check browser console for network errors
  4. Verify authentication token is valid

**Issue**: Data doesn't appear in table after submission
- **Solution**: Check the `onStockAdded` callback in `RiceStock.jsx` is properly updating the state

**Issue**: CORS errors
- **Solution**: Backend must include appropriate CORS headers:
  ```
  Access-Control-Allow-Origin: http://localhost:3000
  Access-Control-Allow-Methods: POST, GET, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
  ```

---

## Future Enhancements

Potential improvements:
1. Add image upload for rice stock
2. Implement barcode/QR code scanning
3. Add bulk import from CSV/Excel
4. Include stock location within warehouse
5. Add expiry date tracking
6. Implement stock reservation system
7. Add stock transfer between warehouses
8. Include batch number tracking
9. Add supplier information
10. Implement real-time stock notifications

---

## Related Files

- Frontend:
  - `/src/pages/RiceStock.jsx` - Main rice stock page
  - `/src/components/modals/AddStockModal.jsx` - Add stock modal form
  - `/src/services/api/stockService.js` - API service
  - `/src/services/api/axiosConfig.js` - Axios configuration
  - `/src/utils/constants.js` - Constants and options

- Backend (expected):
  - API endpoint at `/api/v1/rice-stock/add`
  - Database model for rice_stock table

---

## Contact

For issues or questions regarding this implementation, please refer to the project maintainers.

---

**Last Updated**: February 5, 2024  
**Version**: 1.0.0
