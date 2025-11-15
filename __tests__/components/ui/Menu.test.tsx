/**
 * Menu component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { Menu, MenuItem, MenuDivider } from '@/components/ui/Menu';

describe('Menu', () => {
  test('renders trigger', () => {
    render(
      <Menu trigger={<button>Menu</button>}>
        <MenuItem>Item 1</MenuItem>
      </Menu>
    );

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('shows items when trigger is clicked', () => {
    render(
      <Menu trigger={<button>Menu</button>}>
        <MenuItem>Item 1</MenuItem>
        <MenuItem>Item 2</MenuItem>
      </Menu>
    );

    const trigger = screen.getByText('Menu');
    fireEvent.click(trigger);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  test('calls onClick when menu item is clicked', () => {
    const handleClick = jest.fn();

    render(
      <Menu trigger={<button>Menu</button>}>
        <MenuItem onClick={handleClick}>Item 1</MenuItem>
      </Menu>
    );

    const trigger = screen.getByText('Menu');
    fireEvent.click(trigger);

    const item = screen.getByText('Item 1');
    fireEvent.click(item);

    expect(handleClick).toHaveBeenCalled();
  });

  test('disables menu item', () => {
    render(
      <Menu trigger={<button>Menu</button>}>
        <MenuItem disabled>Disabled Item</MenuItem>
      </Menu>
    );

    const trigger = screen.getByText('Menu');
    fireEvent.click(trigger);

    const item = screen.getByText('Disabled Item');
    expect(item).toBeDisabled();
  });
});

describe('MenuDivider', () => {
  test('renders divider', () => {
    const { container } = render(<MenuDivider />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });
});
