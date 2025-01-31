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

interface FontSizeValue {
  size: string;
}

interface FontTypeValue {
  type: string;
}

type MarkKeyValuePair = FontSizeValue | FontTypeValue;

function isFontSizeValue(value: MarkKeyValuePair): value is FontSizeValue {
  return (value as FontSizeValue).size !== undefined;
}

function isFontTypeValue(value: MarkKeyValuePair): value is FontTypeValue {
  return (value as FontTypeValue).type !== undefined;
}

const changeFontAttribute = (value: MarkKeyValuePair) => {
  return (state: EditorState, dispatch?: (tr: Transaction) => void): boolean => {
    const { schema, selection } = state;
    const { from, to, empty } = selection;

    let markType: MarkType | null = null;

    if (isFontSizeValue(value)) {
      markType = schema.marks.fontSize;
    } else if (isFontTypeValue(value)) {
      markType = schema.marks.fontType;
    } else {
      throw new Error('Unknown mark type value pair.');
    }

    if (markType && dispatch) {
      const tr = state.tr;

      if (empty) {
        // If the selection is collapsed, add the mark to the cursor position
        const storedMarks = state.storedMarks ?? [];
        const newMark = markType.create(value);

        // Update stored marks to include the font type
        tr.setStoredMarks([...storedMarks.filter((mark) => mark.type !== markType), newMark]);
      } else {
        // If text is selected, apply the mark to the range
        tr.addMark(from, to, markType.create(value));
      }

      dispatch(tr.scrollIntoView());
    }
    return true;
  };
};

const changeFontType = (type: string) => {
  return changeFontAttribute({ type });
};

function changeFontSize(size: string) {
  return changeFontAttribute({ size });
}

export { changeFontSize, changeFontType, toggleBold, toggleItalic, toggleSub, toggleSup };
