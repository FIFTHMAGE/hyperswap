/**
 * Breadcrumb component tests
 */

import { render, screen } from '@testing-library/react';

import { Breadcrumb } from '@/components/ui/Breadcrumb';

describe('Breadcrumb', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Category', href: '/category' },
    { label: 'Current Page' },
  ];

  test('renders all items', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Current Page')).toBeInTheDocument();
  });

  test('renders links for items with href', () => {
    render(<Breadcrumb items={items} />);
    const homeLink = screen.getByText('Home');
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });

  test('renders span for items without href', () => {
    render(<Breadcrumb items={items} />);
    const currentPage = screen.getByText('Current Page');
    expect(currentPage.tagName).toBe('SPAN');
  });

  test('shows separators between items', () => {
    const { container } = render(<Breadcrumb items={items} />);
    const separators = container.querySelectorAll('.text-gray-400');
    expect(separators.length).toBeGreaterThan(0);
  });

  test('uses custom separator', () => {
    render(<Breadcrumb items={items} separator=">" />);
    expect(screen.getByText('>')).toBeInTheDocument();
  });
});
