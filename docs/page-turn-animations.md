# Page Turn Animation Utilities

This document describes the horizontal scale transition system for page changes in the Bowie Book project.

## Animation Concept

The page transition uses a modern, clean horizontal scale effect rather than skeuomorphic page turning:
- Current page content scales horizontally from 100% to 0% width
- At the midpoint (50%), the content is completely compressed
- Content then scales back to 100% width revealing the new page
- Creates a smooth replacement effect between pages

## CSS Classes

### Animation Classes
- `animate-page-turn` - Horizontal scale transition animation
- `animate-page-transition-overlay` - Subtle overlay effect during transition

### Wrapper Classes
- `page-wrapper` - Container class optimized for smooth transitions

## CSS Variables

### `--page-turn-duration`
- **Default:** `0.6s`
- **Purpose:** Controls the duration of the horizontal scale transition
- **Usage:** Applied to the scale animation
- **Example:** `--page-turn-duration: 0.8s;` for slower transition

### `--page-turn-ease`
- **Default:** `cubic-bezier(0.4, 0.0, 0.2, 1)`
- **Purpose:** Controls the easing curve for smooth acceleration/deceleration
- **Usage:** Applied to all page transition animations
- **Example:** `--page-turn-ease: ease-in-out;` for different timing

## Tailwind Configuration

The following classes have been added to the safelist in `tailwind.config.ts` to ensure they are always available in the build:

```typescript
safelist: [
  'animate-page-turn',
  'animate-page-transition-overlay'
]
```

## Usage Examples

### Basic Page Transition
```html
<div class="page-wrapper">
  <div class="animate-page-turn">
    <!-- Page content -->
  </div>
</div>
```

### With Transition Overlay
```html
<div class="page-wrapper animate-page-turn">
  <img src="page-image.jpg" alt="Page content" />
  <!-- Overlay effect is automatically applied via ::before pseudo-element -->
</div>
```

### Custom Animation Duration
```css
.custom-slow-transition {
  --page-turn-duration: 0.8s;
}
```

### Custom Easing
```css
.custom-easing {
  --page-turn-ease: ease-in-out;
}
```

## Implementation Notes

- Animation uses hardware acceleration with `will-change` properties for optimal performance
- Transform origin is set to `center center` for natural scaling
- Animations respect `prefers-reduced-motion` for accessibility (shows instant page changes)
- Overlay effects are automatically applied via CSS pseudo-elements
- Classes follow Tailwind's `animate-*` naming convention for consistency
- Animation prevents user interaction during transition to avoid conflicts

## Animation Keyframes

The `pageTransition` keyframe animation:
```css
@keyframes pageTransition {
  0% {
    transform: scaleX(1);
    opacity: 1;
  }
  50% {
    transform: scaleX(0);
    opacity: 0.5;
  }
  100% {
    transform: scaleX(1);
    opacity: 1;
  }
}
```

## Accessibility Features

- **Reduced Motion Support**: Users with `prefers-reduced-motion: reduce` see instant page changes
- **Keyboard Navigation**: Arrow keys work during and after animations
- **Screen Reader Friendly**: Page changes are announced properly
- **Touch Accessibility**: Touch zones meet minimum 44px requirement

## Performance Optimizations

- **GPU Acceleration**: Uses `transform` and `opacity` for hardware acceleration
- **Efficient Animations**: Avoids layout-triggering properties
- **Memory Management**: Animation classes are properly cleaned up
- **Low-Power Device Support**: Lightweight animation works on older devices
