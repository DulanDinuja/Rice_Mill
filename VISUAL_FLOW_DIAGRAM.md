# Rice Stock Add Feature - Visual Flow Diagram

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RiceStock.jsx (Page)                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ [New Sale] [Export] [➕ Add Stock] ← Button                │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Rice Stock Table                                           │ │
│  │ ┌────────────┬──────────┬───────────┬────────┬──────────┐ │ │
│  │ │ Rice Type  │ Quantity │ Warehouse │ Grade  │ Price    │ │ │
│  │ ├────────────┼──────────┼───────────┼────────┼──────────┤ │ │
│  │ │ White Raw  │ 1000 kg  │ Main WH   │   A    │ $45.50   │ │ │
│  │ └────────────┴──────────┴───────────┴────────┴──────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ onClick={() => setIsAddModalOpen(true)}
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               AddStockModal.jsx (Modal Component)               │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Add Rice Stock                                       [X]  │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │                                                            │ │
│  │ ⚠️  Error Display (if error occurs)                       │ │
│  │                                                            │ │
│  │ Rice Type*           [Select Rice Type ▼]                 │ │
│  │ Warehouse*           [____________________]               │ │
│  │ Customer Name        [____________________]               │ │
│  │ Customer ID          [____________________]               │ │
│  │ Mobile Number        [____________________]               │ │
│  │ Quantity*            [____________________]               │ │
│  │ Unit                 [kg ▼]                               │ │
│  │ Grade                [A ▼]                                │ │
│  │ Price per kg*        [____________________]               │ │
│  │                                                            │ │
│  │                      [Cancel] [Add Stock / Adding...]     │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ onSubmit(formData)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              stockService.js (API Service Layer)                │
│                                                                  │
│  addRiceStock(stockData) {                                      │
│    if (USE_MOCK) {                                             │
│      // Save to localStorage                                   │
│      return mockData;                                          │
│    }                                                            │
│    return axiosInstance.post('/v1/rice-stock/add', stockData);│
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                   ┌──────────┴──────────┐
                   │                     │
              USE_MOCK = true      USE_MOCK = false
                   │                     │
                   ▼                     ▼
    ┌───────────────────────┐  ┌─────────────────────┐
    │   localStorage        │  │   axiosConfig.js    │
    │   (Mock Data)         │  │   (HTTP Client)     │
    └───────────────────────┘  └─────────────────────┘
                                         │
                                         │ POST /v1/rice-stock/add
                                         ▼
                              ┌─────────────────────┐
                              │   Backend API       │
                              │ http://localhost:   │
                              │      8080/api       │
                              └─────────────────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │     Database        │
                              │   (rice_stock       │
                              │      table)         │
                              └─────────────────────┘
```

---

## Data Flow Sequence

```
1. USER ACTION
   └─ Click "Add Stock" button

2. MODAL OPENS
   └─ AddStockModal component renders
   └─ Form fields initialized with defaults

3. USER INPUT
   └─ User fills form fields
   └─ Client-side validation occurs

4. FORM SUBMIT
   └─ User clicks "Add Stock" button
   └─ Button changes to "Adding..." (disabled)
   └─ Form inputs disabled

5. API CALL
   ├─ Mock Mode (USE_MOCK = true)
   │  └─ Save to localStorage
   │  └─ Return mock response immediately
   │
   └─ API Mode (USE_MOCK = false)
      └─ POST to http://localhost:8080/api/v1/rice-stock/add
      └─ Include JWT token in Authorization header
      └─ Send JSON request body

6. RESPONSE HANDLING
   ├─ SUCCESS
   │  └─ Call onStockAdded(newStock)
   │  └─ Close modal
   │  └─ Reset form
   │  └─ Update stock table
   │  └─ Show new entry in table
   │
   └─ ERROR
      └─ Display error message in modal
      └─ Keep modal open
      └─ Re-enable form for retry
      └─ Button returns to "Add Stock"
```

---

## State Management Flow

```
AddStockModal Component States:

┌─────────────────────────────────────────────────────────┐
│ formData                                                 │
│ ├─ riceType: ''                                         │
│ ├─ quantity: ''                                         │
│ ├─ unit: 'kg'                                           │
│ ├─ warehouse: ''                                        │
│ ├─ grade: 'A'                                           │
│ ├─ pricePerKg: ''                                       │
│ ├─ customerName: ''                                     │
│ ├─ customerId: ''                                       │
│ ├─ mobileNumber: ''                                     │
│ └─ status: 'In Stock'                                   │
├─────────────────────────────────────────────────────────┤
│ isSubmitting: false → true (during submit) → false     │
├─────────────────────────────────────────────────────────┤
│ error: null → "error message" (on error) → null        │
└─────────────────────────────────────────────────────────┘
```

---

## Request/Response Examples

### Request to Backend API

```http
POST /api/v1/rice-stock/add HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

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

### Success Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "id": 123,
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

### Error Response

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "message": "Validation failed",
  "error": "pricePerKg must be a positive number"
}
```

---

## UI State Visualization

### Initial State
```
┌──────────────────────────────────────┐
│ Add Rice Stock                  [X] │
├──────────────────────────────────────┤
│                                      │
│ Rice Type*      [Select Rice Type ▼]│
│ Warehouse*      [__________________]│
│ ...                                  │
│                                      │
│               [Cancel] [Add Stock]  │
└──────────────────────────────────────┘

State:
  isSubmitting: false
  error: null
  Button: enabled, text: "Add Stock"
```

### During Submission
```
┌──────────────────────────────────────┐
│ Add Rice Stock                  [X] │
├──────────────────────────────────────┤
│                                      │
│ Rice Type*      [White Raw ▼]      │ ← Disabled
│ Warehouse*      [Main WH]          │ ← Disabled
│ ...                                  │
│                                      │
│              [Cancel] [Adding...]   │ ← Both disabled
└──────────────────────────────────────┘

State:
  isSubmitting: true
  error: null
  Button: disabled, text: "Adding..."
  Form inputs: disabled
```

### Error State
```
┌──────────────────────────────────────┐
│ Add Rice Stock                  [X] │
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐│
│ │ ⚠️  Failed to add stock.         ││ ← Error message
│ │     Please try again.            ││
│ └──────────────────────────────────┘│
│                                      │
│ Rice Type*      [White Raw ▼]      │ ← Enabled
│ Warehouse*      [Main WH]          │ ← Enabled
│ ...                                  │
│                                      │
│               [Cancel] [Add Stock]  │ ← Enabled
└──────────────────────────────────────┘

State:
  isSubmitting: false
  error: "Failed to add stock. Please try again."
  Button: enabled, text: "Add Stock"
  Form inputs: enabled
```

### Success State (Modal Closes)
```
Modal closed automatically
Stock table updated with new entry:

┌────────────┬──────────┬───────────┬────────┬──────────┐
│ Rice Type  │ Quantity │ Warehouse │ Grade  │ Price    │
├────────────┼──────────┼───────────┼────────┼──────────┤
│ White Raw  │ 1000 kg  │ Main WH   │   A    │ $45.50   │ ← New entry
│ Steam Nadu │ 500 kg   │ Warehouse │   B+   │ $38.00   │
└────────────┴──────────┴───────────┴────────┴──────────┘
```

---

## Integration Points Summary

| Component | Responsibility | Key Props/Methods |
|-----------|---------------|-------------------|
| RiceStock.jsx | Page container | `setIsAddModalOpen(true)` |
| AddStockModal.jsx | Form UI & validation | `onStockAdded`, `onClose` |
| stockService.js | API communication | `addRiceStock(data)` |
| axiosConfig.js | HTTP client config | `post(url, data)` |
| Backend API | Data persistence | `/api/v1/rice-stock/add` |

---

## File Dependencies

```
RiceStock.jsx
  ├─ imports AddStockModal
  ├─ imports stockService
  └─ imports NeonButton

AddStockModal.jsx
  ├─ imports Modal
  ├─ imports NeonButton
  ├─ imports RICE_TYPES, UNITS, GRADES
  └─ imports stockService

stockService.js
  ├─ imports axiosInstance
  ├─ imports mockRiceStocks
  └─ imports localStorageService

axiosConfig.js
  ├─ imports axios
  └─ imports API_BASE_URL
```

---

## Configuration Summary

| Setting | Value | Location |
|---------|-------|----------|
| USE_MOCK | `true` (development) | `stockService.js` line 5 |
| API_BASE_URL | `http://localhost:8080/api` | `constants.js` line 1 |
| API Endpoint | `/v1/rice-stock/add` | `stockService.js` line 72 |
| Auth Token | `access_token` | `localStorage` |

---

## Testing Checklist

- [x] ✅ Code compiles without errors
- [x] ✅ No linting errors in changed files
- [x] ✅ Code review passed
- [x] ✅ Security scan passed
- [ ] ⏳ Manual UI testing (requires browser)
- [ ] ⏳ API integration testing (requires backend)
- [ ] ⏳ Mobile responsiveness testing
- [ ] ⏳ Dark mode testing
- [ ] ⏳ Error scenario testing
- [ ] ⏳ Network failure testing

---

**Diagram Created**: February 5, 2024  
**Status**: Implementation Complete  
**Next Step**: Manual UI Testing
