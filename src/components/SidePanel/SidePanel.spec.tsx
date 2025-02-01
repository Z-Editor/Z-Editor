import { fireEvent, render, screen } from '@testing-library/react';
import { EditorState } from 'prosemirror-state';
import { describe, expect, it, vi } from 'vitest';
import SidePanel, { SidePanelProps } from './SidePanel';
import userEvent from '@testing-library/user-event';
import { Handle } from '../Editor/Editor';
import { sideBarSymbols } from './constants';

describe('SidePanel', () => {
	const mockSetEditorState = {selection: { from: 0, to: 1 }, tr: { insertText: vi.fn() }, apply: vi.fn() } as unknown  as EditorState;
	const mockEditorRef = { current: { view: { focus: vi.fn() } } };
	const defaultProps: SidePanelProps = {
		editorState: mockSetEditorState,
		setEditorState: vi.fn(),
		editorRef: mockEditorRef as unknown as React.RefObject<Handle>,
	};

  it('renders in collapsed state by default', () => {
    render(<SidePanel {...defaultProps} />);
    expect(screen.getByText('<<')).toBeInTheDocument();
  });

  it('expands when collapse button is clicked', () => {
    render(<SidePanel {...defaultProps} />);
    const collapseButton = screen.getByText('<<');
    fireEvent.click(collapseButton);
    expect(screen.getByText('>>')).toBeInTheDocument();
  });

  it('collapses when expand button is clicked', () => {
    render(<SidePanel {...defaultProps} />);
    const collapseButton = screen.getByText('<<');
    fireEvent.click(collapseButton);
    const expandButton = screen.getByText('>>');
    fireEvent.click(expandButton);
    expect(screen.getByText('<<')).toBeInTheDocument();
  });

  it('inserts symbol when clicked', async () => {
    render(<SidePanel {...defaultProps} />);

    // Expand panel first
    const collapseButton = screen.getByText('<<');
    fireEvent.click(collapseButton);

    // Click first symbol
    const symbols = await screen.findAllByTestId('symbol');
    await userEvent.click(symbols[0]);

    expect(mockSetEditorState.apply).toHaveBeenCalled();
    expect(mockEditorRef.current.view.focus).toHaveBeenCalled();
  });

  it('renders all symbol sections', async () => {
    render(<SidePanel {...defaultProps} />);

    // Expand panel first
    const collapseButton = await screen.findByText('<<');
    await userEvent.click(collapseButton);

    const sections = await screen.findAllByTestId('symbol-section');
    expect(sections).toHaveLength(sideBarSymbols.length);
  });

  it('renders correct symbols in each section', async () => {
    render(<SidePanel {...defaultProps} />);

    // Expand panel first
    const collapseButton = await screen.findByText('<<');
    await userEvent.click(collapseButton);

    const symbols = await screen.findAllByTestId('symbol');
    const expectedSymbolCount = sideBarSymbols.reduce((acc, section) => acc + section.data.length, 0);
    expect(symbols).toHaveLength(expectedSymbolCount);
  });
});