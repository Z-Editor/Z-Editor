import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DropDownMenu } from './DropDownMenu';

describe('DropDownMenu', () => {
  it('renders the button with the provided text', () => {
    render(<DropDownMenu text="Options" options={[]} />);

    expect(screen.getByText('Options')).toBeInTheDocument();
  });

  it('opens the dropdown menu when the button is clicked and closes when clicked again', () => {
    render(<DropDownMenu text="Options" options={[{ label: 'Option 1', onClick: vi.fn() }]} />);
    const button = screen.getByText('Options');

    fireEvent.click(button);

    expect(screen.getByText('Option 1')).toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  it('calls the onClick handler and closes the dropdown when an option is clicked', () => {
    const onClick = vi.fn();
    const options = [{ label: 'Option 1', onClick }];
    render(<DropDownMenu text="Options" options={options} />);

    const button = screen.getByText('Options');

    fireEvent.click(button);

    const option = screen.getByText('Option 1');

    fireEvent.click(option);

    expect(onClick).toHaveBeenCalled();

    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });
});
