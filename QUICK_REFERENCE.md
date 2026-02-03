# 📋 Reports Feature - Quick Reference

## 🚀 Quick Start

### 1. Access Reports
```
Sidebar → Reports → Reports & Analytics
```

### 2. Generate Simple Report
```
1. Select Report Type: "Paddy Sale Report"
2. Click "Generate Report"
3. Done! ✅
```

### 3. Generate Filtered Report
```
1. Click "This Month" (quick date)
2. Select Report Type: "Rice Sale Report"
3. Select Warehouse: "Main Warehouse"
4. Select Rice Type: "Basmati"
5. Click "Generate Report"
6. Done! ✅
```

### 4. Export to CSV
```
1. Generate a report (steps above)
2. Click "Export Report"
3. File downloads automatically
4. Open in Excel/Sheets
```

---

## 📊 Report Types

| # | Report Name | What It Shows |
|---|-------------|---------------|
| 1 | Paddy Threshing | All threshing operations with moisture levels |
| 2 | Paddy Sale | Paddy sales transactions |
| 3 | Paddy Add Stock | New paddy inventory additions |
| 4 | Rice Sale | Rice sales transactions |
| 5 | Rice Add Stock | New rice inventory additions |

---

## 🔍 Available Filters

### Always Available
- ✅ **Date Range** (From/To dates)
- ✅ **Report Type** (Required)
- ✅ **Warehouse** (Optional)

### Paddy Reports Only
- ✅ **Paddy Type** (Nadu, Keeri Samba, Samba)
- ✅ **Supplier** (Various suppliers)

### Rice Reports Only
- ✅ **Rice Type** (White Raw, Steam Nadu, etc.)

---

## ⚡ Quick Date Buttons

| Button | Date Range |
|--------|-----------|
| Today | Today's date only |
| This Month | 1st of current month to today |
| Last 6 Months | 6 months ago to today |
| This Year | January 1st to today |

---

## 📈 What You See

### Summary Cards (Top)
```
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Total   │  │ Total   │  │ Date    │
│ Records │  │ Quantity│  │ Range   │
└─────────┘  └─────────┘  └─────────┘
```

### Chart (Middle)
```
Bar chart showing monthly stock movement
- Green bars = Rice
- Purple bars = Paddy
```

### Table (Bottom)
```
Data table with pagination
- 10 items per page
- Color-coded action types
- Formatted values
```

---

## 🎨 Color Codes

### Action Type Badges
- 🔴 **Red** = Sale (stock out)
- 🟢 **Green** = Add Stock (stock in)
- 🔵 **Blue** = Threshing (processing)

### Grade Badges
- 🟣 **Purple** = Quality grade (A+, A, B, etc.)

---

## 📱 Mobile Tips

1. **Scroll horizontally** for full table view
2. **Tap buttons** to select filters
3. **Pinch zoom** on chart if needed
4. **Pull down** to refresh data

---

## 🔧 Common Tasks

### Task: Monthly Sales Report
```
1. Click "This Month"
2. Select "Rice Sale Report"
3. Generate → Export
```

### Task: Supplier Performance
```
1. Set date range (e.g., last 3 months)
2. Select "Paddy Add Stock Report"
3. Select specific Supplier
4. Generate
```

### Task: Warehouse Inventory
```
1. Click "This Year"
2. Select any report type
3. Select specific Warehouse
4. Generate
```

### Task: Product Analysis
```
1. Set date range
2. Select "Rice Sale Report"
3. Select Rice Type (e.g., "Basmati")
4. Generate → View totals
```

---

## ⚠️ Important Notes

### Required Fields
- ⚠️ **Report Type** is mandatory
- ℹ️ All other filters are optional

### Date Validation
- ⚠️ "From Date" must be earlier than "To Date"
- ℹ️ Leave blank for "all time" data

### No Results?
- Check if data exists in system
- Try broader date range
- Remove optional filters
- Check console for errors

---

## 💡 Pro Tips

### Tip 1: Quick Analysis
```
Use "Last 6 Months" + specific type
for quick trend analysis
```

### Tip 2: Detailed Reports
```
Combine multiple filters for
precise, focused reports
```

### Tip 3: Regular Exports
```
Export weekly/monthly reports
for record keeping
```

### Tip 4: Compare Periods
```
Generate same report for different
date ranges to compare
```

---

## 🎯 Example Workflows

### Weekly Stock Review
```
Monday morning:
1. "This Month" → All report types
2. Review totals
3. Export for records
4. Share with team
```

### Month-End Reporting
```
Last day of month:
1. "This Month" → Each report type
2. Generate all reports
3. Export all to CSV
4. Create summary
5. Archive reports
```

### Supplier Audit
```
Quarterly:
1. "Last 6 Months"
2. "Paddy Add Stock Report"
3. Filter by each Supplier
4. Compare quantities
5. Assess performance
```

### Product Performance
```
Monthly:
1. "This Month"
2. "Rice Sale Report"
3. Filter by each Rice Type
4. Compare sales volumes
5. Identify top sellers
```

---

## 📊 Data Columns Reference

### Paddy Reports
| Column | Description | Example |
|--------|-------------|---------|
| Paddy Type | Type of paddy | Nadu |
| Quantity | Amount in kg | 1,000 kg |
| Moisture % | Moisture level | 14% |
| Warehouse | Storage location | Main Warehouse |
| Supplier | Paddy supplier | Farmer Co-op A |
| Action Type | Operation type | Threshing/Sale |
| Date | Transaction date | Jan 15, 2025 |

### Rice Reports
| Column | Description | Example |
|--------|-------------|---------|
| Rice Type | Type of rice | Basmati |
| Grade | Quality grade | A+ |
| Quantity | Amount in kg | 500 kg |
| Warehouse | Storage location | Main Warehouse |
| Price/kg | Unit price | Rs. 120.00 |
| Action Type | Operation type | Sale/Add Stock |
| Date | Transaction date | Jan 15, 2025 |

---

## 🆘 Troubleshooting

### Problem: "No results found"
**Solution:**
1. Check date range is not too narrow
2. Verify report type is selected
3. Remove optional filters
4. Try "Last 6 Months" button

### Problem: Export not working
**Solution:**
1. Make sure report is generated first
2. Check browser allows downloads
3. Try different browser if needed
4. Check disk space

### Problem: Slow loading
**Solution:**
1. Use shorter date ranges
2. Add more filters to narrow results
3. Clear browser cache
4. Refresh page

### Problem: Wrong data showing
**Solution:**
1. Verify correct report type selected
2. Check all filters are as intended
3. Regenerate report
4. Clear filters and start over

---

## 📞 Quick Support

### Check These First:
1. ✅ Is report type selected?
2. ✅ Is date range valid?
3. ✅ Did you click "Generate Report"?
4. ✅ Does data exist in system?

### Still Having Issues?
1. Refresh the page
2. Clear browser cache
3. Check browser console (F12)
4. Review localStorage data

---

## ⌨️ Keyboard Shortcuts

```
Tab       → Navigate between filters
Enter     → Submit/Generate (when focused on input)
Escape    → Clear focus
Space     → Toggle dropdowns
```

---

## 📚 Related Pages

- **Dashboard** → Quick overview & stats
- **Rice Stock** → Manage rice inventory
- **Paddy Stock** → Manage paddy inventory
- **Sales** → Record transactions
- **Warehouse** → Manage locations

---

## ✅ Best Practices

### For Accuracy
- ✅ Generate reports regularly
- ✅ Use consistent date ranges
- ✅ Export for backup
- ✅ Verify totals match expectations

### For Efficiency
- ✅ Use quick date buttons
- ✅ Save common filter combinations
- ✅ Schedule regular reporting times
- ✅ Create naming convention for exports

### For Analysis
- ✅ Compare same periods
- ✅ Track trends over time
- ✅ Analyze by warehouse
- ✅ Monitor supplier performance

---

## 🎯 Success Metrics

After generating a report, check:
- ✅ Total records count makes sense
- ✅ Quantity totals are reasonable
- ✅ Date range is as expected
- ✅ Chart shows relevant trends
- ✅ No errors in console

---

## 🚀 Get Started Now!

```
1. Go to Reports page
2. Click "This Month"
3. Select any report type
4. Click "Generate Report"
5. Explore the data!
```

**That's it! You're ready to generate powerful reports! 📊**

---

**Quick Reference Version:** 1.0
**Last Updated:** February 2, 2026
**Status:** Production Ready ✅
