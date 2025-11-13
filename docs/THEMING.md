# Theming Guide

## Color System

### CSS Variables

All colors are defined as CSS variables in `app/globals.css`:

```css
:root {
  --background: #0a0a0a;
  --foreground: #ededed;
  --primary: #8b5cf6;
  --secondary: #ec4899;
  --accent: #f59e0b;
}
```

### Dark Mode

Dark mode is automatically applied using Tailwind's `dark:` prefix:

```tsx
<div className="bg-white dark:bg-gray-900">
  Content
</div>
```

## Typography

### Font Family

Primary font: Inter (loaded from next/font/google)

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
```

### Font Sizes

- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px)
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl`: 1.875rem (30px)

## Custom Theme Creation

### 1. Define Colors

Add new color variables in `tailwind.config.ts`:

```ts
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... more shades
          900: '#0c4a6e',
        },
      },
    },
  },
};
```

### 2. Use in Components

```tsx
<Button className="bg-brand-600 hover:bg-brand-700">
  Custom Button
</Button>
```

## Gradients

Pre-defined gradients:

```css
.gradient-purple-pink {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
}

.gradient-gold {
  background: linear-gradient(135deg, #f59e0b, #dc2626);
}
```

## Animations

### Transition Classes

```tsx
<div className="transition-all duration-300 ease-in-out">
  Animated content
</div>
```

### Custom Animations

Define in `tailwind.config.ts`:

```ts
animation: {
  'fade-in': 'fadeIn 0.5s ease-in',
  'slide-up': 'slideUp 0.3s ease-out',
},
keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  slideUp: {
    '0%': { transform: 'translateY(20px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
}
```

## Responsive Design

### Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Usage

```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>
```

