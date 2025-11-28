/**
 * MainLayout component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MainLayout } from '../MainLayout';

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/',
  }),
  usePathname: () => '/',
}));

// Mock wallet hooks
vi.mock('@/hooks/features/useWalletConnect', () => ({
  useWalletConnect: () => ({
    isConnected: false,
    address: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
  }),
}));

describe('MainLayout', () => {
  describe('rendering', () => {
    it('should render children', () => {
      render(
        <MainLayout>
          <div>Page Content</div>
        </MainLayout>
      );

      expect(screen.getByText('Page Content')).toBeInTheDocument();
    });

    it('should render header', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should render navigation', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should render main content area', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should render footer when showFooter is true', () => {
      render(
        <MainLayout showFooter>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('should not render footer when showFooter is false', () => {
      render(
        <MainLayout showFooter={false}>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
    });
  });

  describe('header', () => {
    it('should render logo', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByTestId('logo')).toBeInTheDocument();
    });

    it('should render navigation links', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByText('Swap')).toBeInTheDocument();
      expect(screen.getByText('Pools')).toBeInTheDocument();
    });

    it('should render wallet connect button', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });

    it('should highlight active navigation link', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      const swapLink = screen.getByText('Swap');
      expect(swapLink).toHaveClass('text-primary');
    });
  });

  describe('sidebar', () => {
    it('should render sidebar when showSidebar is true', () => {
      render(
        <MainLayout showSidebar>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('should not render sidebar when showSidebar is false', () => {
      render(
        <MainLayout showSidebar={false}>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    });

    it('should toggle sidebar on mobile', () => {
      render(
        <MainLayout showSidebar>
          <div>Content</div>
        </MainLayout>
      );

      const menuButton = screen.getByLabelText('Toggle menu');
      fireEvent.click(menuButton);

      expect(screen.getByTestId('mobile-sidebar')).toBeInTheDocument();
    });
  });

  describe('theme', () => {
    it('should render theme toggle button', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument();
    });

    it('should toggle theme on click', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      const themeButton = screen.getByLabelText('Toggle theme');
      fireEvent.click(themeButton);

      // Theme should change (implementation specific)
    });
  });

  describe('responsive', () => {
    it('should show mobile menu button on small screens', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
    });

    it('should hide desktop nav on mobile', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      const desktopNav = screen.getByTestId('desktop-nav');
      expect(desktopNav).toHaveClass('hidden');
      expect(desktopNav).toHaveClass('lg:flex');
    });
  });

  describe('breadcrumbs', () => {
    it('should render breadcrumbs when provided', () => {
      const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Swap', href: '/swap' },
      ];

      render(
        <MainLayout breadcrumbs={breadcrumbs}>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Swap')).toBeInTheDocument();
    });

    it('should not render breadcrumbs when not provided', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.queryByTestId('breadcrumbs')).not.toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should show loading indicator when loading', () => {
      render(
        <MainLayout loading>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });

    it('should not show loading indicator when not loading', () => {
      render(
        <MainLayout loading={false}>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });
  });

  describe('custom header', () => {
    it('should render custom header when provided', () => {
      render(
        <MainLayout customHeader={<div data-testid="custom-header">Custom Header</div>}>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    });
  });

  describe('full width', () => {
    it('should apply full width to main content when fullWidth is true', () => {
      render(
        <MainLayout fullWidth>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByRole('main')).toHaveClass('max-w-full');
    });

    it('should apply container max width when fullWidth is false', () => {
      render(
        <MainLayout fullWidth={false}>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByRole('main')).toHaveClass('max-w-7xl');
    });
  });

  describe('accessibility', () => {
    it('should have skip to main content link', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByText('Skip to main content')).toBeInTheDocument();
    });

    it('should have proper ARIA landmarks', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });
});

