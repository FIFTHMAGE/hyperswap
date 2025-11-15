/**
 * Portal component tests
 */

import { render } from '@testing-library/react';

import { Portal } from '@/components/ui/Portal';

describe('Portal', () => {
  test('renders children in portal', () => {
    const { baseElement } = render(
      <Portal>
        <div data-testid="portal-content">Portal content</div>
      </Portal>
    );

    const portalContent = baseElement.querySelector('[data-testid="portal-content"]');
    expect(portalContent).toBeInTheDocument();
  });

  test('renders in custom container', () => {
    const container = document.createElement('div');
    container.id = 'custom-portal';
    document.body.appendChild(container);

    render(
      <Portal container={container}>
        <div data-testid="custom-portal-content">Custom portal</div>
      </Portal>
    );

    const customContent = container.querySelector('[data-testid="custom-portal-content"]');
    expect(customContent).toBeInTheDocument();

    document.body.removeChild(container);
  });
});
