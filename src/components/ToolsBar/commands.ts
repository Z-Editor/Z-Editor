import { toggleMark } from 'prosemirror-commands';
import { Attrs, MarkType } from 'prosemirror-model';
import { Command, EditorState, Transaction } from 'prosemirror-state';

import { schema } from '../Editor/schema';

function toggleMarkCommand(mark: MarkType, attr?: Attrs): Command {
  return (state: EditorState, dispatch: ((tr: Transaction) => void) | undefined) =>
    toggleMark(mark, attr)(state, dispatch);
}

const toggleBold = toggleMarkCommand(schema.marks.strong);
const toggleItalic = toggleMarkCommand(schema.marks.em);
const toggleSup = toggleMarkCommand(schema.marks.superscript);
const toggleSub = toggleMarkCommand(schema.marks.subscript);

export { toggleBold, toggleItalic, toggleSub, toggleSup };
