# Accessibility Guide

## Features

### Implemented

- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader support
- ✅ Reduced motion mode
- ✅ High contrast mode compatible
- ✅ Semantic HTML structure

### Keyboard Shortcuts

- `→` / `←` : Navigate between cards
- `Escape` : Close modals
- `Cmd/Ctrl + S` : Share current card
- `Tab` : Navigate focusable elements

### Screen Reader Support

All interactive elements have descriptive labels:
- Buttons have clear action descriptions
- Images have alt text
- Forms have associated labels
- Status updates are announced

### Testing

Use these tools:
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse Accessibility Audit](https://developer.chrome.com/docs/lighthouse/)

### Best Practices

1. Always use semantic HTML
2. Provide text alternatives for images
3. Ensure keyboard accessibility
4. Use ARIA labels appropriately
5. Test with screen readers
6. Respect user preferences (reduced motion)

## WCAG Compliance

Targeting WCAG 2.1 Level AA compliance:
- ✅ Color contrast ratios
- ✅ Focus visible
- ✅ Keyboard accessible
- ✅ Text alternatives
- ✅ Responsive text sizing

