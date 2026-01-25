# Mobile Testing Guide for Rice Mill Inventory System

## Quick Test Checklist

### 1. Test on Different Viewports

#### Mobile Portrait (320px - 480px)
- [ ] Sidebar is hidden by default
- [ ] Hamburger menu appears in navbar
- [ ] Clicking hamburger opens sidebar with overlay
- [ ] Sidebar slides in smoothly from left
- [ ] Clicking overlay closes sidebar
- [ ] Navigation links work and close sidebar
- [ ] All buttons show only icons (text hidden)
- [ ] Tables scroll horizontally
- [ ] Form fields stack vertically
- [ ] Modal buttons are full width

#### Mobile Landscape (568px - 767px)
- [ ] Same as portrait but more breathing room
- [ ] Tables still scroll but more columns visible
- [ ] Buttons may show text on larger screens

#### Tablet (768px - 1023px)
- [ ] Sidebar still hidden by default
- [ ] Search bar becomes visible
- [ ] More columns visible in tables
- [ ] Form fields in 2 columns
- [ ] Modal buttons side by side

#### Desktop (1024px+)
- [ ] Sidebar always visible
- [ ] Hamburger menu hidden
- [ ] All features fully visible
- [ ] Optimal layout and spacing

### 2. Navigation Testing

#### Sidebar
- [ ] Open sidebar on mobile (hamburger)
- [ ] Click each navigation item
- [ ] Verify sidebar closes after navigation
- [ ] Test backdrop click to close
- [ ] Test close button (X)

#### Navbar
- [ ] Hamburger menu visible on mobile
- [ ] Search hidden on small screens
- [ ] Mobile search icon works
- [ ] Theme toggle works
- [ ] Notifications bell visible
- [ ] User profile adapts (icon only on mobile)

### 3. Page-Specific Tests

#### Dashboard
- [ ] Stats cards stack 1 column on mobile
- [ ] Stats cards show 2 columns on tablet
- [ ] Stats cards show 4 columns on desktop
- [ ] Activity cards stack on mobile
- [ ] Activity cards side by side on desktop
- [ ] Text sizes are readable

#### Rice Stock / Paddy Stock
- [ ] Header stacks on mobile
- [ ] Buttons show icons only on mobile
- [ ] Buttons equal width on mobile
- [ ] Search bar full width
- [ ] Table scrolls horizontally
- [ ] All columns preserved (no data hidden)
- [ ] Text readable but condensed
- [ ] Badges fit properly

#### Reports
- [ ] Chart height adjusted for mobile
- [ ] Chart remains interactive
- [ ] Legend visible
- [ ] Data points accessible

#### Warehouse
- [ ] Cards stack on mobile
- [ ] Progress bars visible
- [ ] Temperature/humidity icons visible
- [ ] All info readable

#### Settings
- [ ] Toggle switches work
- [ ] Settings stack nicely
- [ ] Save button accessible

### 4. Modal Testing

#### Add Stock Modal
- [ ] Modal centered on screen
- [ ] Close button visible and works
- [ ] Form fields stack on mobile
- [ ] All inputs full width on mobile
- [ ] Labels readable
- [ ] Cancel/Submit buttons stack on mobile
- [ ] Buttons full width on mobile

#### Sale Modal
- [ ] Dropdown shows all stock
- [ ] Customer fields stack
- [ ] Quantity/price fields stack
- [ ] Total amount visible
- [ ] Complete sale button works

#### Export Modal
- [ ] Format buttons side by side (2 columns)
- [ ] Icons and text visible
- [ ] Date range dropdown works
- [ ] Info box readable
- [ ] Export/cancel buttons stack

### 5. Touch Interaction Tests

- [ ] All buttons minimum 44px height
- [ ] Tap targets comfortable
- [ ] No accidental double-taps
- [ ] Smooth scrolling
- [ ] No iOS zoom on input focus
- [ ] Tap highlight visible

### 6. Visual Tests

#### Light Mode
- [ ] All colors appropriate
- [ ] Contrast sufficient
- [ ] Shadows visible
- [ ] Gradients render well

#### Dark Mode
- [ ] Glass effect visible
- [ ] Neon colors vibrant
- [ ] Text readable
- [ ] Borders visible

### 7. Performance Tests

- [ ] Sidebar animation smooth
- [ ] Page transitions fluid
- [ ] No layout shifts
- [ ] Scroll performance good
- [ ] Modal animations smooth

### 8. Browser Tests

Test on:
- [ ] Safari iOS
- [ ] Chrome iOS
- [ ] Chrome Android
- [ ] Firefox Android
- [ ] Samsung Internet

### 9. Orientation Tests

- [ ] Portrait to landscape works
- [ ] Landscape to portrait works
- [ ] No broken layouts
- [ ] Content reflows properly

### 10. Edge Cases

- [ ] Very long text in table cells
- [ ] Large numbers in inputs
- [ ] Many notifications
- [ ] Long customer names
- [ ] Large stock quantities

## Common Issues to Watch For

1. **Text Overflow**: Check that long text doesn't break layout
2. **Button Text**: Ensure icon-only buttons are clear
3. **Table Width**: Verify tables don't shrink columns too much
4. **Modal Size**: Modals should fit on small screens
5. **Input Zoom**: iOS shouldn't zoom when focusing inputs (16px min font)
6. **Safe Areas**: Check iPhone notch areas
7. **Keyboard Overlap**: Ensure inputs visible with keyboard open

## Testing Tools

### Browser DevTools
- Chrome DevTools device emulation
- Firefox Responsive Design Mode
- Safari Responsive Design Mode

### Physical Devices
- iPhone SE (320px) - smallest modern phone
- iPhone 13/14 (390px) - standard iPhone
- iPad (768px) - standard tablet
- Android phones (various sizes)

### Online Tools
- BrowserStack
- LambdaTest
- Responsively App

## Quick Browser Console Test

```javascript
// Test responsive breakpoints
window.addEventListener('resize', () => {
  console.log(`Width: ${window.innerWidth}px`);
  if (window.innerWidth < 640) console.log('📱 Mobile');
  else if (window.innerWidth < 768) console.log('📱 Large Mobile');
  else if (window.innerWidth < 1024) console.log('📱 Tablet');
  else console.log('💻 Desktop');
});
```

## Lighthouse Mobile Score Targets

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

## Accessibility Checklist

- [ ] Touch targets 44x44px minimum
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Keyboard navigation works
- [ ] Screen reader friendly labels
- [ ] ARIA labels on icon-only buttons

## Success Criteria

✅ All pages render correctly on mobile
✅ No horizontal overflow
✅ All interactions work with touch
✅ Text is readable without zoom
✅ No content is hidden or inaccessible
✅ Performance is acceptable
✅ Dark/light modes both work

## Report Issues

When reporting issues, include:
1. Device/browser
2. Screen size
3. Screenshot
4. Steps to reproduce
5. Expected vs actual behavior
