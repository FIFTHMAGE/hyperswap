/**
 * WithLoading pattern tests
 */

import { render, screen } from '@testing-library/react';

import { WithLoading } from '@/components/patterns/WithLoading';

describe('WithLoading', () => {
  test('shows loading state', () => {
    render(
      <WithLoading isLoading={true} loadingMessage="Loading...">
        <div>Content</div>
      </WithLoading>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  test('shows children when not loading', () => {
    render(
      <WithLoading isLoading={false}>
        <div>Content</div>
      </WithLoading>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
