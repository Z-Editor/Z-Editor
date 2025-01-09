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

function changeFontSize(size: string) {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { schema, selection } = state;
    const { from, to, empty } = selection;
    const markType: MarkType | undefined = schema.marks.fontSize;

    if (markType && dispatch) {
      const tr = state.tr;

      if (empty) {
        // If the selection is collapsed, add the mark to the cursor position
        const storedMarks = state.storedMarks ?? [];
        const newMark = markType.create({ size });

        // Update stored marks to include the font size
        tr.setStoredMarks([...storedMarks.filter((mark) => mark.type !== markType), newMark]);
      } else {
        // If text is selected, apply the mark to the range
        tr.addMark(from, to, markType.create({ size }));
      }

      dispatch(tr.scrollIntoView());
    }
    return true;
  };
}

export { changeFontSize, toggleBold, toggleItalic, toggleSub, toggleSup };
