# Light Mode CSS Quick Reference

## 🎨 Color Variables (Use These!)

```css
/* Backgrounds */
--bg-base: linear-gradient(180deg, #F8FAF9 0%, #FDFBF6 100%);
--bg-card: linear-gradient(135deg, #FFFFFF 0%, #FAFBFA 100%);

/* Text Colors */
--text-primary: #263238;    /* Charcoal */
--text-secondary: #546E7A;  /* Blue-gray */
--text-muted: #78909C;      /* Light blue-gray */
--text-active: #1B5E20;     /* Dark green */

/* Brand Colors */
--green-primary: #2E7D32;   /* Forest green */
--green-light: #388E3C;     /* Light green */
--green-bg: #E8F5E9;        /* Pale green */
--gold: #F9A825;            /* Gold accent */

/* Borders */
--border-subtle: rgba(46, 125, 50, 0.12);
--border-medium: rgba(46, 125, 50, 0.15);
--border-strong: rgba(46, 125, 50, 0.25);
```

## 📦 Card Styles

### Standard Card
```css
.premium-card {
  background: linear-gradient(135deg, #FFFFFF 0%, #FAFBFA 100%);
  border: 1px solid rgba(46, 125, 50, 0.12);
  border-radius: 1.25rem; /* 20px */
  box-shadow:
    0 1px 2px rgba(46, 125, 50, 0.04),
    0 4px 12px rgba(46, 125, 50, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
```

### Hover State
```css
.premium-card:hover {
  transform: translateY(-4px) scale(1.005);
  box-shadow:
    0 2px 4px rgba(46, 125, 50, 0.06),
    0 8px 20px rgba(46, 125, 50, 0.12),
    0 16px 40px rgba(46, 125, 50, 0.08),
    0 0 0 1px rgba(46, 125, 50, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 1);
  border-color: rgba(46, 125, 50, 0.25);
}
```

## 🔘 Button Styles

### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, #2E7D32 0%, #388E3C 100%);
  color: #FFFFFF;
  border: 1px solid rgba(46, 125, 50, 0.3);
  border-radius: 12px;
  box-shadow:
    0 1px 2px rgba(46, 125, 50, 0.15),
    0 4px 8px rgba(46, 125, 50, 0.2),
    0 8px 16px rgba(46, 125, 50, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0) scale(0.98);
}
```

### Secondary Button
```css
.btn-secondary {
  background: linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%);
  color: #2E7D32;
  border: 1px solid rgba(46, 125, 50, 0.2);
  /* Same shadow as primary */
}
```

## 📝 Input Styles

```css
.input-premium {
  background: linear-gradient(135deg, #FFFFFF 0%, #FAFBFA 100%);
  border: 1.5px solid rgba(46, 125, 50, 0.15);
  border-radius: 12px;
  color: #263238;
  box-shadow:
    0 1px 2px rgba(46, 125, 50, 0.04),
    0 2px 4px rgba(0, 0, 0, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.input-premium:focus {
  background: #FFFFFF;
  border-color: #2E7D32;
  box-shadow:
    0 0 0 3px rgba(46, 125, 50, 0.12),
    0 2px 4px rgba(46, 125, 50, 0.08),
    0 4px 8px rgba(46, 125, 50, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  outline: none;
}

.input-premium::placeholder {
  color: #78909C;
  opacity: 0.7;
}
```

## 🏷️ Badge Styles

```css
/* Success Badge */
.badge-success {
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.12), rgba(46, 125, 50, 0.18));
  color: #1B5E20;
  border: 1px solid rgba(46, 125, 50, 0.25);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Warning Badge */
.badge-warning {
  background: linear-gradient(135deg, rgba(249, 168, 37, 0.12), rgba(249, 168, 37, 0.18));
  color: #E65100;
  border: 1px solid rgba(249, 168, 37, 0.25);
}

/* Error Badge */
.badge-error {
  background: linear-gradient(135deg, rgba(211, 47, 47, 0.12), rgba(211, 47, 47, 0.18));
  color: #B71C1C;
  border: 1px solid rgba(211, 47, 47, 0.25);
}
```

## 🔔 Alert Styles

```css
/* Success Alert */
.alert-success {
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.05), rgba(46, 125, 50, 0.08));
  border: 1px solid rgba(46, 125, 50, 0.2);
  border-radius: 0.75rem;
  padding: 1rem;
  color: #1B5E20;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 2px 4px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}
```

## 🎨 Tailwind Utility Combos

### Premium Card Container
```jsx
<div className="bg-gradient-to-br from-white to-[#FAFBFA] rounded-[20px] 
                border border-[#2E7D32]/10 
                shadow-[0_1px_2px_rgba(46,125,50,0.04),0_4px_12px_rgba(46,125,50,0.08)]
                hover:shadow-[0_8px_20px_rgba(46,125,50,0.12)]
                transition-all duration-300">
  {/* Content */}
</div>
```

### Premium Button
```jsx
<button className="bg-gradient-to-br from-[#2E7D32] to-[#388E3C] 
                   text-white rounded-xl px-6 py-3
                   shadow-[0_4px_8px_rgba(46,125,50,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]
                   hover:shadow-[0_6px_12px_rgba(46,125,50,0.25)]
                   hover:-translate-y-0.5
                   active:scale-[0.98]
                   transition-all duration-200">
  Submit
</button>
```

### Premium Input
```jsx
<input className="bg-gradient-to-br from-white to-[#FAFBFA]
                  border-[1.5px] border-[#2E7D32]/15
                  rounded-xl px-4 py-3
                  text-[#263238] placeholder:text-[#78909C]/70
                  focus:bg-white focus:border-[#2E7D32]
                  focus:ring-4 focus:ring-[#2E7D32]/10
                  transition-all duration-200"
       placeholder="Enter value..." />
```

## 🎯 Common Patterns

### Section Header
```jsx
<h2 className="text-2xl font-semibold text-[#1A237E] mb-4">
  Section Title
</h2>
<p className="text-sm text-[#78909C] uppercase tracking-wider mb-6">
  SECTION SUBTITLE
</p>
```

### Divider
```jsx
<div className="h-px bg-gradient-to-r from-transparent via-[#2E7D32]/15 to-transparent my-6" />
```

### Status Indicator
```jsx
<div className="flex items-center gap-2">
  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#388E3C]" />
  <span className="text-sm text-[#546E7A]">Active</span>
</div>
```

### Hover Card
```jsx
<div className="glass-card glass-card-hover p-6 cursor-pointer">
  {/* Interactive content */}
</div>
```

## 📱 Responsive Considerations

```css
/* Mobile: Reduce shadow complexity */
@media (max-width: 768px) {
  .glass-card {
    box-shadow:
      0 2px 8px rgba(46, 125, 50, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
}

/* Desktop: Full premium effects */
@media (min-width: 769px) {
  .glass-card {
    box-shadow:
      0 1px 2px rgba(46, 125, 50, 0.04),
      0 4px 12px rgba(46, 125, 50, 0.08),
      0 8px 24px rgba(0, 0, 0, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
}
```

## 🎨 Shadow Presets

```css
/* Micro - Subtle definition */
--shadow-micro: 0 1px 2px rgba(46, 125, 50, 0.04);

/* Small - Card at rest */
--shadow-sm: 0 2px 4px rgba(46, 125, 50, 0.06),
             0 4px 8px rgba(0, 0, 0, 0.04);

/* Medium - Standard elevation */
--shadow-md: 0 4px 12px rgba(46, 125, 50, 0.08),
             0 8px 24px rgba(0, 0, 0, 0.04);

/* Large - Hover/Focus state */
--shadow-lg: 0 8px 20px rgba(46, 125, 50, 0.12),
             0 16px 40px rgba(46, 125, 50, 0.08);

/* XLarge - Modal/Overlay */
--shadow-xl: 0 12px 24px rgba(46, 125, 50, 0.08),
             0 24px 48px rgba(0, 0, 0, 0.08),
             0 48px 96px rgba(0, 0, 0, 0.04);
```

## ✨ Pro Tips

1. **Always include inset highlight** on cards for depth
2. **Use multiple shadow layers** for realistic elevation
3. **Gradients should be subtle** (2-5% difference max)
4. **Transitions**: 200ms for interactions, 300ms for layouts
5. **Green tint** in borders/shadows for brand consistency
6. **Round corners** 12px-24px for premium feel
7. **Text hierarchy**: Use weight + color, not just size

---

Quick copy-paste ready! 🚀
