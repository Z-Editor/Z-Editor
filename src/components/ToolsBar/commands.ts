import { toggleMark } from 'prosemirror-commands';
import { MarkType } from 'prosemirror-model';
import { Command, EditorState, Transaction } from 'prosemirror-state';

import { schema } from '../Editor/schema';

function toggleMarkCommand(mark: MarkType): Command {
  return (state: EditorState, dispatch: ((tr: Transaction) => void) | undefined) => toggleMark(mark)(state, dispatch);
}

const toggleBold = toggleMarkCommand(schema.marks.strong);
const toggleItalic = toggleMarkCommand(schema.marks.em);

export { toggleBold, toggleItalic };
