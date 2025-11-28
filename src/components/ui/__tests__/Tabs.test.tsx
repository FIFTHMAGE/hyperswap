/**
 * Tabs component tests
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../Tabs';

describe('Tabs', () => {
  const renderTabs = (props = {}) => {
    return render(
      <Tabs defaultValue="tab1" {...props}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>
    );
  };

  describe('rendering', () => {
    it('should render tabs component', () => {
      renderTabs();

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(3);
    });

    it('should render tab triggers', () => {
      renderTabs();

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeInTheDocument();
    });

    it('should show default tab content', () => {
      renderTabs();

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeVisible();
    });
  });

  describe('selection', () => {
    it('should switch tabs on click', async () => {
      renderTabs();

      await userEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(screen.getByText('Content 2')).toBeVisible();
      expect(screen.queryByText('Content 1')).not.toBeVisible();
    });

    it('should call onChange when tab changes', async () => {
      const handleChange = vi.fn();
      renderTabs({ onValueChange: handleChange });

      await userEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(handleChange).toHaveBeenCalledWith('tab2');
    });

    it('should mark selected tab as active', async () => {
      renderTabs();

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab2).toHaveAttribute('aria-selected', 'false');

      await userEvent.click(tab2);

      expect(tab1).toHaveAttribute('aria-selected', 'false');
      expect(tab2).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('controlled mode', () => {
    it('should work in controlled mode', async () => {
      const TestComponent = () => {
        const [value, setValue] = vi.importActual<typeof import('react')>('react').useState('tab1');
        return (
          <Tabs value={value} onValueChange={setValue}>
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
          </Tabs>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('Content 1')).toBeVisible();

      await userEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(screen.getByText('Content 2')).toBeVisible();
    });
  });

  describe('disabled tabs', () => {
    it('should disable tab when disabled prop is true', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" disabled>
              Tab 2
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeDisabled();
    });

    it('should not switch to disabled tab on click', async () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" disabled>
              Tab 2
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      await userEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(screen.getByText('Content 1')).toBeVisible();
      expect(screen.queryByText('Content 2')).not.toBeVisible();
    });
  });

  describe('keyboard navigation', () => {
    it('should navigate with arrow keys', async () => {
      renderTabs();

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      tab1.focus();

      await userEvent.keyboard('{ArrowRight}');

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
    });

    it('should wrap around on arrow key navigation', async () => {
      renderTabs();

      const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
      tab3.focus();

      await userEvent.keyboard('{ArrowRight}');

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveFocus();
    });

    it('should navigate backwards with left arrow', async () => {
      renderTabs();

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      tab2.focus();

      await userEvent.keyboard('{ArrowLeft}');

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveFocus();
    });

    it('should select tab on Enter', async () => {
      renderTabs();

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      tab2.focus();

      await userEvent.keyboard('{Enter}');

      expect(tab2).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Content 2')).toBeVisible();
    });

    it('should select tab on Space', async () => {
      renderTabs();

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      tab2.focus();

      await userEvent.keyboard(' ');

      expect(tab2).toHaveAttribute('aria-selected', 'true');
    });

    it('should go to first tab on Home', async () => {
      renderTabs();

      const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
      tab3.focus();

      await userEvent.keyboard('{Home}');

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveFocus();
    });

    it('should go to last tab on End', async () => {
      renderTabs();

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      tab1.focus();

      await userEvent.keyboard('{End}');

      expect(screen.getByRole('tab', { name: 'Tab 3' })).toHaveFocus();
    });
  });

  describe('orientation', () => {
    it('should render horizontal orientation by default', () => {
      renderTabs();

      expect(screen.getByRole('tablist')).toHaveAttribute(
        'aria-orientation',
        'horizontal'
      );
    });

    it('should render vertical orientation', () => {
      renderTabs({ orientation: 'vertical' });

      expect(screen.getByRole('tablist')).toHaveAttribute(
        'aria-orientation',
        'vertical'
      );
    });

    it('should use up/down arrows in vertical mode', async () => {
      renderTabs({ orientation: 'vertical' });

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      tab1.focus();

      await userEvent.keyboard('{ArrowDown}');

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
    });
  });

  describe('variants', () => {
    it('should render default variant', () => {
      renderTabs({ variant: 'default' });

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should render pills variant', () => {
      renderTabs({ variant: 'pills' });

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should render underline variant', () => {
      renderTabs({ variant: 'underline' });

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should render enclosed variant', () => {
      renderTabs({ variant: 'enclosed' });

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('should render small size', () => {
      renderTabs({ size: 'sm' });

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should render medium size', () => {
      renderTabs({ size: 'md' });

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should render large size', () => {
      renderTabs({ size: 'lg' });

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper aria attributes', () => {
      renderTabs();

      const tablist = screen.getByRole('tablist');
      const tabs = screen.getAllByRole('tab');
      const tabpanel = screen.getByRole('tabpanel');

      expect(tablist).toBeInTheDocument();
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[0]).toHaveAttribute('aria-controls');
      expect(tabpanel).toHaveAttribute('aria-labelledby');
    });

    it('should connect tab to panel via aria-controls', () => {
      renderTabs();

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const panelId = tab1.getAttribute('aria-controls');

      expect(screen.getByRole('tabpanel')).toHaveAttribute('id', panelId);
    });
  });

  describe('icons in tabs', () => {
    it('should render tab with icon', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">
              <span data-testid="icon">📊</span>
              Dashboard
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Dashboard Content</TabsContent>
        </Tabs>
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  describe('lazy loading', () => {
    it('should not mount content until tab is selected when lazy', () => {
      const onMount = vi.fn();

      const LazyContent = () => {
        vi.importActual<typeof import('react')>('react').useEffect(() => {
          onMount();
        }, []);
        return <div>Lazy Content</div>;
      };

      render(
        <Tabs defaultValue="tab1" lazy>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">
            <LazyContent />
          </TabsContent>
        </Tabs>
      );

      expect(onMount).not.toHaveBeenCalled();
    });
  });
});

