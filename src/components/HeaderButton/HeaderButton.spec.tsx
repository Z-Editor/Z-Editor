import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HeaderButton from './HeaderButton';

describe('HeaderButton', () => {
  it('renders with provided text', () => {
    render(<HeaderButton text="Test Button" />);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('has correct CSS class', () => {
    render(<HeaderButton text="Test Button" />);
    expect(screen.getByRole('button')).toHaveClass('header-button');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<HeaderButton text="Test Button" onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('works without onClick handler', () => {
    render(<HeaderButton text="Test Button" />);
    const button = screen.getByRole('button');

    expect(() => {
      fireEvent.click(button);
    }).not.toThrow();
  });
});