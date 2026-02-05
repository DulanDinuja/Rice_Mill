# Rice Stock Add Feature - User Guide

## Overview
This guide explains how to use the Rice Stock Add functionality in the application.

---

## Step-by-Step User Flow

### Step 1: Navigate to Rice Stock Page
- Click on "Rice Stock" in the navigation menu
- You will see a list of all rice stocks in the system

### Step 2: Click "Add Stock" Button
- Located in the top right corner of the page
- The button has a **Plus (+)** icon
- Button text: "Add Stock" (on desktop) or just the icon (on mobile)

### Step 3: Fill Out the Add Stock Form

The modal form contains the following fields:

#### Required Fields (must be filled):
1. **Rice Type** (Dropdown)
   - Options: White Raw, Steam Nadu, Steam Keeri, Red Raw, Keeri White Raw
   
2. **Warehouse** (Text Input)
   - Enter the warehouse name where the stock will be stored
   
3. **Quantity** (Number Input)
   - Enter the quantity of rice stock
   
4. **Price per kg** (Number Input)
   - Enter the price per kilogram
   - Accepts decimal values (e.g., 45.50)

#### Optional Fields:
5. **Unit** (Dropdown)
   - Default: kg
   - Options: kg, ton, quintal, bags
   
6. **Grade** (Dropdown)
   - Default: A
   - Options: A+, A, B+, B, C
   
7. **Customer Name** (Text Input)
   - Optional customer information
   
8. **Customer ID** (Text Input)
   - Optional customer identifier
   
9. **Mobile Number** (Tel Input)
   - Optional customer contact number

### Step 4: Submit the Form
- Click the **"Add Stock"** button at the bottom of the form
- The button will change to **"Adding..."** while processing
- Form inputs will be disabled during submission

### Step 5: See the Results

#### Success Scenario:
- The modal will close automatically
- The new stock will appear in the rice stock table
- You'll see all the information you entered in the table

#### Error Scenario:
- An error message will appear at the top of the form
- The message will be displayed in a red alert box
- The form will remain open for you to correct any issues
- You can try submitting again after making corrections

### Step 6: Cancel (Optional)
- Click the **"Cancel"** button to close the form without saving
- This will discard any data you entered
- The modal will close and return you to the rice stock list

---

## Visual Layout

```
┌─────────────────────────────────────────────────────────┐
│  Rice Stock                                             │
│  Manage your rice inventory                             │
│                                         [New Sale]      │
│                                         [Export]        │
│                                         [+ Add Stock]   │
└─────────────────────────────────────────────────────────┘

When you click "Add Stock", this modal appears:

┌─────────────────────────────────────────────────────────┐
│  Add Rice Stock                                    [X]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │ ⚠️ Error message appears here if needed         │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  Rice Type*              Warehouse*                     │
│  [Select Rice Type ▼]    [___________________]         │
│                                                         │
│  Customer Name           Customer ID                    │
│  [___________________]   [___________________]         │
│                                                         │
│  Mobile Number                                          │
│  [___________________]                                  │
│                                                         │
│  Quantity*               Unit                           │
│  [___________________]   [kg ▼]                        │
│                                                         │
│  Grade                   Price per kg*                  │
│  [A ▼]                   [___________________]         │
│                                                         │
│                                [Cancel]  [Add Stock]   │
└─────────────────────────────────────────────────────────┘

After successful submission, the table updates:

┌─────────────────────────────────────────────────────────┐
│  [Search rice type...]                                  │
├────────────────────────────────────────────────────────┤
│ Rice Type  │ Quantity │ Warehouse │ Grade │ Price      │
├────────────┼──────────┼───────────┼───────┼───────────┤
│ White Raw  │ 1000 kg  │ Main WH   │  A    │ $45.50    │
│ Steam Nadu │ 500 kg   │ Warehouse │  B+   │ $38.00    │
│ (Your new entry appears here)                          │
└────────────────────────────────────────────────────────┘
```

---

## Form Validation

### Browser Validation:
- Required fields will show a red outline if left empty
- Number fields will only accept numeric values
- Price field accepts decimals for cents/paise

### Submission Validation:
- Form cannot be submitted while required fields are empty
- Duplicate submissions are prevented (button disabled during submission)

---

## Current Mode: Mock/Development Mode

**Important**: The application is currently running in **mock mode**.

### What This Means:
- Data is stored in your browser's localStorage
- No real backend API connection is needed
- Data persists across page refreshes
- Data is only available on your browser/device

### To Use Real API:
When the backend is ready, the development team will:
1. Switch the `USE_MOCK` flag to `false`
2. Ensure the backend API is running
3. The same form will then save data to the database
4. No changes needed to your user experience

---

## Tips and Best Practices

### Data Entry:
- ✅ Always fill required fields (marked with *)
- ✅ Double-check quantity and price before submitting
- ✅ Select appropriate grade for quality tracking
- ✅ Use consistent warehouse naming

### Error Handling:
- 📖 Read error messages carefully
- 🔄 Try submitting again if there's a network error
- 💾 Data is not saved if an error occurs

### Performance:
- ⚡ Form submits quickly (usually < 1 second)
- 📱 Works on mobile, tablet, and desktop
- 🌙 Supports both light and dark themes

---

## Troubleshooting

### Problem: Form doesn't submit
**Solution**: Check that all required fields are filled

### Problem: "Adding..." never completes
**Solution**: 
- Check your internet connection
- Contact IT support if problem persists
- Refresh the page and try again

### Problem: Stock doesn't appear in table
**Solution**: 
- Refresh the page
- Check if there's a search filter applied

### Problem: Modal won't open
**Solution**: 
- Refresh the page
- Clear browser cache
- Try a different browser

---

## API Endpoint (For Technical Users)

- **Method**: POST
- **URL**: `http://localhost:8080/api/v1/rice-stock/add`
- **Authentication**: Bearer token (automatic)
- **Content-Type**: application/json

---

## Support

If you encounter any issues or need help:
1. Check this guide first
2. Contact your system administrator
3. Report bugs through the proper channels

---

**Last Updated**: February 5, 2024
