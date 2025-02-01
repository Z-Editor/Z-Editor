import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import ToolButton from './ToolButton';

describe('ToolButton', () => {
  const defaultProps = {
    children: 'Test Button',
    isActive: false,
    className: 'test-class',
    onClick: vi.fn(),
  };

  it('renders with correct initial styles when inactive', () => {
    render(<ToolButton {...defaultProps} />);
    const button = screen.getByText('Test Button');

    expect(button).toHaveClass('tool-button', 'test-class');
    expect(button).toHaveStyle({ backgroundColor: '#f4f4f4' });
  });

  it('renders with correct styles when active', () => {
    render(<ToolButton {...defaultProps} isActive={true} />);
    const button = screen.getByText('Test Button');

    expect(button).toHaveStyle({ backgroundColor: '#d3e3fd' });
  });

  it('calls onClick handler when clicked', async () => {
    render(<ToolButton {...defaultProps} />);
    const button = screen.getByText('Test Button');

    await userEvent.click(button);
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('renders children correctly', () => {
    render(
      <ToolButton {...defaultProps}>
        <span>Custom Content</span>
      </ToolButton>,
    );

    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });
});
