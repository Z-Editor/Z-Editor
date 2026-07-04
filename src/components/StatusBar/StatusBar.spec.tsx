import { render, screen } from '@testing-library/react';
import { EditorState } from 'prosemirror-state';
import { describe, expect, it } from 'vitest';

import { schema } from '../Editor';
import StatusBar from './StatusBar';

// Build a real EditorState from paragraphs so textContent/textBetween behave like production.
const stateWithParagraphs = (...paragraphs: string[]) =>
  EditorState.create({
    schema,
    doc: schema.node(
      'doc',
      null,
      paragraphs.map((p) => schema.node('paragraph', null, p ? [schema.text(p)] : [])),
    ),
  });

describe('StatusBar', () => {
  it('shows 0 words for empty content', () => {
    render(<StatusBar editorState={stateWithParagraphs('')} />);
    expect(screen.getByText('0 words')).toBeInTheDocument();
    expect(screen.getByText('0 characters')).toBeInTheDocument();
  });

  it('uses singular "word" for a single word', () => {
    render(<StatusBar editorState={stateWithParagraphs('hello')} />);
    expect(screen.getByText('1 word')).toBeInTheDocument();
  });

  it('counts words split by any whitespace and characters', () => {
    render(<StatusBar editorState={stateWithParagraphs('  the  quick\nbrown ')} />);
    expect(screen.getByText('3 words')).toBeInTheDocument();
  });

  it('counts words across separate paragraphs (block boundaries)', () => {
    render(<StatusBar editorState={stateWithParagraphs('sdfsdf', 'sd', 'fs', 'df')} />);
    expect(screen.getByText('4 words')).toBeInTheDocument();
  });
});
