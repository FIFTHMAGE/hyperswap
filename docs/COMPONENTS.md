# Component Documentation

## UI Components

### Button

Standard button component with variants.

```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `loading`: boolean

### Card

Container component with styling.

```tsx
import { Card } from '@/components/ui/Card';

<Card className="p-6">
  Content here
</Card>
```

### Modal

Accessible modal dialog.

```tsx
import { Modal } from '@/components/ui/Modal';

<Modal isOpen={isOpen} onClose={handleClose}>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>Actions</Modal.Footer>
</Modal>
```

## Story Cards

### StoryCard

Base component for wrapped story cards.

```tsx
import { StoryCard } from '@/components/wrapped/StoryCard';

<StoryCard
  title="Your Stats"
  description="Amazing journey"
  onNext={handleNext}
  onPrevious={handlePrevious}
>
  <div>Card content</div>
</StoryCard>
```

### Creating Custom Story Cards

1. Create new file in `components/wrapped/cards/`
2. Extend `StoryCard`
3. Add animations
4. Export from `index.ts`

## Dashboard Components

### StatCard

Display dashboard statistics.

```tsx
import { StatCard } from '@/components/dashboard/StatCard';

<StatCard
  title="Total Users"
  value="12,345"
  change={12}
  icon="👥"
/>
```

### ChartCard

Display data visualizations.

```tsx
import { ChartCard } from '@/components/dashboard/ChartCard';

<ChartCard
  title="Activity"
  data={[
    { label: 'Jan', value: 100 },
    { label: 'Feb', value: 150 },
  ]}
/>
```

## Mobile Components

### BottomSheet

Mobile-optimized bottom sheet.

```tsx
import { BottomSheet } from '@/components/mobile/BottomSheet';

<BottomSheet isOpen={isOpen} onClose={handleClose}>
  Content
</BottomSheet>
```

### PullToRefresh

Pull-to-refresh functionality.

```tsx
import { PullToRefresh } from '@/components/mobile/PullToRefresh';

<PullToRefresh onRefresh={async () => {
  await fetchData();
}}>
  <div>Content</div>
</PullToRefresh>
```

