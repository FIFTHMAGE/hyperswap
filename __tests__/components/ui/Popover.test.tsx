/**
 * Popover component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';

import { Popover } from '@/components/ui/Popover';

describe('Popover', () => {
  test('renders trigger', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Popover content</div>
      </Popover>
    );

    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  test('shows content when trigger is clicked', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Popover content</div>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    fireEvent.click(trigger);

    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  test('hides content when trigger is clicked again', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Popover content</div>
      </Popover>
    );

    const trigger = screen.getByText('Open');
    fireEvent.click(trigger);
    fireEvent.click(trigger);

    expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
  });

  test('initially hides content', () => {
    render(
      <Popover trigger={<button>Open</button>}>
        <div>Popover content</div>
      </Popover>
    );

    expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
  });
});
