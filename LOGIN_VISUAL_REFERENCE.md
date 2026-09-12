# FeedChain Login Page Redesign - Visual Reference

## Desktop Layout (≥768px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│  ┌─────────────────────────────┬─────────────────────────────────────────┐  │
│  │                             │                                         │  │
│  │                             │  FEEDCHAIN                              │  │
│  │      [Aquatic Logo]         │  Enter your credentials...              │  │
│  │    (Fish + Waves)           │                                         │  │
│  │                             │  ┌─────────────────────────────────────┐ │  │
│  │                             │  │ Username or Email                   │ │  │
│  │   WELCOME                   │  │ [___________________________]       │ │  │
│  │   TO FEEDCHAIN SYSTEM       │  └─────────────────────────────────────┘ │  │
│  │                             │  ┌─────────────────────────────────────┐ │  │
│  │   Integrated solution...    │  │ Password                            │ │  │
│  │   production, inventory,    │  │ [___________________________] [👁]  │ │  │
│  │   distribution, and sales   │  └─────────────────────────────────────┘ │  │
│  │   management...             │                                         │  │
│  │                             │  ☐ Remember me   Forgot password?       │  │
│  │   ✓ Production Management   │                                         │  │
│  │   ✓ Real-time Inventory     │  [      SIGN IN      ]                 │  │
│  │   ✓ Distribution & Sales    │                                         │  │
│  │                             │  ─────── or ───────                    │  │
│  │                             │  [ Sign in with account ]              │  │
│  │                             │                                         │  │
│  │                             │  © 2026 3H Enterprises Ltd.            │  │
│  │ (Blue/Cyan Gradient)        │  (White Background)                    │  │
│  │                             │                                         │  │
│  └─────────────────────────────┴─────────────────────────────────────────┘  │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Tablet Layout (480px - 768px)

```
┌──────────────────────────────────────────────┐
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │                                        │ │
│  │         [Aquatic Logo]                 │ │
│  │       (Fish + Waves - Medium)          │ │
│  │                                        │ │
│  │     WELCOME TO FEEDCHAIN SYSTEM        │ │
│  │                                        │ │
│  │     Integrated solution for...         │ │
│  │                                        │ │
│  │     ✓ Production Management            │ │
│  │     ✓ Real-time Inventory              │ │
│  │     ✓ Distribution & Sales             │ │
│  │                                        │ │
│  ├────────────────────────────────────────┤ │
│  │  FEEDCHAIN                             │ │
│  │  ┌────────────────────────────────────┐│ │
│  │  │ Username or Email                  ││ │
│  │  │ [_________________________________]││ │
│  │  └────────────────────────────────────┘│ │
│  │  ┌────────────────────────────────────┐│ │
│  │  │ Password                           ││ │
│  │  │ [_________________________________][👁]│ │
│  │  └────────────────────────────────────┘│ │
│  │                                        │ │
│  │  ☐ Remember me   Forgot?              │ │
│  │                                        │ │
│  │  [      SIGN IN      ]                │ │
│  │                                        │ │
│  │  ─────── or ───────                  │ │
│  │  [ Sign in with account ]            │ │
│  │                                        │ │
│  └────────────────────────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

## Mobile Layout (<480px)

```
┌──────────────────────────┐
│                          │
│   [Aquatic Logo]         │
│      (Fish + Waves)      │
│                          │
│      FEEDCHAIN           │
│  Aquatic Feed Mgmt       │
│                          │
│  ┌──────────────────────┐│
│  │ Username or Email    ││
│  │ [________________]   ││
│  └──────────────────────┘│
│  ┌──────────────────────┐│
│  │ Password             ││
│  │ [________________][👁]│
│  └──────────────────────┘│
│                          │
│  ☐ Remember me          │
│  Forgot password?        │
│                          │
│  [    SIGN IN    ]       │
│                          │
│  ─────── or ───────      │
│  [ Sign in with... ]     │
│                          │
│  © 2026 3H Enterprises   │
│                          │
└──────────────────────────┘
```

## Color Palette

### Primary Colors
- **Dark Cyan**: #0891B2
- **Cyan**: #06B6D4
- **Light Cyan**: #22D3EE

### Gradient
- **Left Panel Gradient**: From Cyan (#06B6D4) → Blue (#0891B2)
- **Button Gradient**: From Cyan-600 → Blue-600

### Text Colors
- **Headings (Light Background)**: #111827 (Dark Gray)
- **Body Text (Light Background)**: #4B5563 (Medium Gray)
- **Labels**: #374151 (Dark Gray)
- **Headings (Dark Background)**: #FFFFFF (White)
- **Body Text (Dark Background)**: #E0F2FE (Light Cyan)

### Backgrounds
- **Left Panel**: Gradient from Cyan to Blue with opacity variations
- **Right Panel**: #FFFFFF (Pure White)
- **Inputs**: White with gray borders (#D1D5DB)
- **Focus State**: Light cyan ring (#CFFAFE)

### Decorative Elements
- **Wave Opacity**: 0.6 (primary), 0.4 (secondary)
- **Circle Opacity**: 0.3 (large), 0.2 (small)
- **Shadow**: Box shadow on cards for depth

## Typography

### Font Family
- Primary: Tahoma
- Fallback: system-ui, sans-serif
- System emoji fonts for icons

### Font Sizes
- **Desktop Headings (h2)**: 30px (text-3xl)
- **Desktop Heading (h1)**: 48px (text-5xl)
- **Labels**: 14px (text-sm)
- **Body Text**: 16px (text-base)
- **Mobile Headings**: Proportionally smaller

### Font Weights
- **Bold**: 700 (headings)
- **Semibold**: 600 (labels, buttons)
- **Regular**: 400 (body text)

## Button Styles

### Sign In Button
- **Background**: Gradient (Cyan-600 → Blue-600)
- **Hover**: Gradient (Cyan-700 → Blue-700)
- **Text**: White, Semibold
- **Padding**: py-3, px-4
- **Border Radius**: lg (8px)
- **Shadow**: Box shadow with hover intensification
- **Transition**: All 200ms

### Secondary Button
- **Background**: White
- **Border**: 2px solid #D1D5DB
- **Text**: #374151 (Dark Gray), Medium
- **Hover**: #F9FAFB (Light Gray)
- **Transition**: Colors 200ms

## Input Field Styles

### Active State
- **Border**: 2px solid #D1D5DB (Gray)
- **Background**: White
- **Text**: Dark Gray

### Focus State
- **Border**: 2px solid #06B6D4 (Cyan)
- **Ring**: 2px solid #CFFAFE (Light Cyan)
- **Outline**: None

### Placeholder
- **Color**: #A3A3A3 (Medium Gray)

## Special Elements

### Logo Component
- **SVG-based** aquatic theme
- **Elements**:
  - Fish silhouette (center)
  - Water waves (bottom)
  - Feed pellets (scattered)
  - Decorative circles (background)
- **Colors**: Gradient fills matching brand colors
- **Responsive**: Scales from 96x96px (mobile) to 192x192px (desktop)

### Error Message Banner
- **Background**: #FEF2F2 (Light Red)
- **Border**: 1px solid #FECACA (Light Red)
- **Text**: #B91C1C (Dark Red)
- **Padding**: 16px
- **Border Radius**: lg (8px)

### Feature List (Left Panel)
- **Icon**: ✓ checkmark
- **Color**: #22D3EE (Light Cyan)
- **Text**: #F0F9FF (Very Light Cyan)
- **Spacing**: Vertical spacing between items

## Responsive Breakpoints

| Breakpoint | Width      | Layout         |
|-----------|----------|----------------|
| Mobile    | < 480px  | Stacked        |
| Tablet    | 480-768px| Split (adjusted)|
| Desktop   | ≥ 768px  | Full split     |

## Animation & Transitions

### Hover Effects
- **Button**: 200ms gradient transition
- **Input Focus**: 300ms color transition
- **Link Hover**: 150ms color transition

### Decorative Animations
- Wave shapes have subtle blur effects
- Circle backgrounds with opacity transitions
- No excessive animations to maintain professionalism

## Accessibility Features

✓ High contrast ratios (WCAG AA compliant)
✓ Semantic HTML structure
✓ Proper label associations
✓ Keyboard navigation support
✓ Clear focus indicators
✓ Touch-friendly input sizes (44px minimum)
✓ Readable font sizes at all breakpoints

## Browser Support

✓ Chrome/Chromium (90+)
✓ Firefox (88+)
✓ Safari (14+)
✓ Edge (90+)
✓ Mobile browsers
  - iOS Safari (14+)
  - Chrome Mobile
  - Firefox Mobile
  - Samsung Internet

## Dark Mode Considerations

Current design uses light theme. For future dark mode support:
- Invert color scheme on right panel
- Keep left panel similar (already dark)
- Adjust text colors for readability
- Use `prefers-color-scheme` media query
