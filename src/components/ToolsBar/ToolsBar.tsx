import './ToolsBar.css';

import { MarkType } from 'prosemirror-model';
import { EditorState, TextSelection } from 'prosemirror-state';
import { ComponentType } from 'react';

import schemaFull from '../../assets/full.svg';
import schemaHalf from '../../assets/half.svg';
import schemaInverse from '../../assets/inverse.svg';
import { Handle } from '../Editor/Editor';
import { schema } from '../Editor/schema';
import { ToolButton } from '../ToolButton';
import { changeFontSize, changeFontType, toggleBold, toggleItalic, toggleSub, toggleSup } from './commands';

function isBold(state: EditorState): boolean {
  return isMarkActive(state, schema.marks.strong);
}

function isItalic(state: EditorState): boolean {
  return isMarkActive(state, schema.marks.em);
}

function isSup(state: EditorState): boolean {
  return isMarkActive(state, schema.marks.superscript);
}

function isSub(state: EditorState): boolean {
  return isMarkActive(state, schema.marks.subscript);
}

function deriveFontSize(state: EditorState): string {
  console.log(getCurrentFontSize(state));
  return getCurrentFontSize(state) ?? '16px';
}

function deriveFontType(state: EditorState): string {
  console.log(getCurrentFontType(state));
  return getCurrentFontType(state) ?? 'Arial';
}

// https://github.com/ProseMirror/prosemirror-example-setup/blob/afbc42a68803a57af3f29dd93c3c522c30ea3ed6/src/menu.js#L57-L61
function isMarkActive(state: EditorState, mark: MarkType): boolean {
  const { from, $from, to, empty } = state.selection;
  return empty ? !!mark.isInSet(state.storedMarks ?? $from.marks()) : state.doc.rangeHasMark(from, to, mark);
}

function getCurrentFontSize(state: EditorState): string | null {
  const { from, to } = state.selection;
  const markType = state.schema.marks.fontSize;
  let updatedFrom = from;

  if (from - to === 0 && from !== 0) {
    updatedFrom = from - 1;
  }

  let fontSize: string | null = null;
  state.doc.nodesBetween(updatedFrom, to, (node) => {
    if (node.marks) {
      const fontSizeMark = node.marks.find((mark) => mark.type === markType);
      if (fontSizeMark) {
        fontSize = String(fontSizeMark.attrs?.size);
      }
    }
  });

  return fontSize;
}

function getCurrentFontType(state: EditorState): string | null {
  const { from, to } = state.selection;
  const markType = state.schema.marks.fontType;
  let updatedFrom = from;

  if (from - to === 0 && from !== 0) {
    updatedFrom = from - 1;
  }

  let fontSize: string | null = null;
  state.doc.nodesBetween(updatedFrom, to, (node) => {
    if (node.marks) {
      const fontTypeMark = node.marks.find((mark) => mark.type === markType);
      if (fontTypeMark) {
        fontSize = String(fontTypeMark.attrs?.type);
      }
    }
  });

  return fontSize;
}

const schemaConfig = [
  {
    icon: schemaFull,
    title: 'schema full',
    handleSchemaInsert: function (editorState: EditorState, setEditorState: (editorState: EditorState) => void) {
      const { tr, selection, doc } = editorState;
      const { from, to } = selection;

      let selectedText = null;
      if (from !== to) {
        const text = doc.textBetween(from, to, '');
        selectedText = schema.text(text, [schema.marks.em.create()]);
      }

      const customBlock = [
        schema.nodes.schema_heading.create({}, selectedText),
        schema.nodes.schema_roof.create({}, null),
        schema.nodes.schema_top.create({}, schema.nodes.paragraph.create({}, null)),
        schema.nodes.schema_bottom.create({}, schema.nodes.paragraph.create({}, null)),
      ];

      const paragraph = schema.nodes.paragraph.create({}, null);
      if (customBlock) {
        tr.replaceWith(from - 1, to, [...customBlock, paragraph]);
        // Set the cursor inside the schema_top's paragraph
        const posAfterInsert = to + 1;
        tr.setSelection(TextSelection.near(tr.doc.resolve(posAfterInsert)));
        setEditorState(editorState.apply(tr));
      }
    },
  },
  {
    icon: schemaHalf,
    title: 'schema half',
    handleSchemaInsert: function (editorState: EditorState, setEditorState: (editorState: EditorState) => void) {
      const { tr, selection, doc } = editorState;
      const { from, to } = selection;

      let selectedText = null;
      if (from !== to) {
        const text = doc.textBetween(from, to, '');
        selectedText = schema.text(text, [schema.marks.em.create()]);
      }

      const customBlock = [
        schema.nodes.schema_heading.create({}, selectedText),
        schema.nodes.schema_roof.create({}, null),
        schema.nodes.schema_bottom.create({}, schema.nodes.paragraph.create({}, null)),
      ];

      const paragraph = schema.nodes.paragraph.create({}, null);
      if (customBlock) {
        tr.replaceWith(from - 1, to, [...customBlock, paragraph]);
        // Set the cursor inside the schema_top's paragraph
        const posAfterInsert = to + 1;
        tr.setSelection(TextSelection.near(tr.doc.resolve(posAfterInsert)));
        setEditorState(editorState.apply(tr));
      }
    },
  },
  {
    icon: schemaInverse,
    title: 'schema inverse',
    handleSchemaInsert: function (editorState: EditorState, setEditorState: (editorState: EditorState) => void) {
      const { tr, selection } = editorState;
      const { from, to } = selection;

      const customBlock = [
        schema.nodes.schema_top.create({}, schema.nodes.paragraph.create({}, null)),
        schema.nodes.schema_left_bar.create({}, schema.nodes.paragraph.create({}, null)),
      ];

      const paragraph = schema.nodes.paragraph.create({}, null);
      if (customBlock) {
        tr.replaceWith(from - 1, to - 1, [...customBlock, paragraph]);
        // Set the cursor inside the schema_top's paragraph
        const posAfterInsert = tr.selection.from + 1; // Move into the schema_top node
        tr.setSelection(TextSelection.near(tr.doc.resolve(posAfterInsert)));
        setEditorState(editorState.apply(tr));
      }
    },
  },
];

const fontSizes = Array.from({ length: 13 }, (_, i) => 12 + i);

interface ToolsBarProps {
  editorState: EditorState;
  setEditorState: (editorState: EditorState) => void;
  editorRef: React.RefObject<Handle>;
}

const ToolsBar: ComponentType<ToolsBarProps> = ({ editorState, setEditorState, editorRef }) => {
  const handleFontSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const size = event.target.value;
    changeFontSize(size)(editorState, (tr) => setEditorState(editorState.apply(tr)));
    editorRef.current?.view?.focus();
  };

  const handleFontTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.value;
    changeFontType(type)(editorState, (tr) => setEditorState(editorState.apply(tr)));
    editorRef.current?.view?.focus();
  };

  return (
    <div className="menu">
      <ToolButton
        className="bold"
        isActive={isBold(editorState)}
        onClick={() => toggleBold(editorState, (tr) => setEditorState(editorState.apply(tr)))}
      >
        B
      </ToolButton>
      <ToolButton
        className="italic"
        isActive={isItalic(editorState)}
        onClick={() => toggleItalic(editorState, (tr) => setEditorState(editorState.apply(tr)))}
      >
        I
      </ToolButton>
      <ToolButton
        className="supsubscript"
        isActive={isSup(editorState)}
        onClick={() => toggleSup(editorState, (tr) => setEditorState(editorState.apply(tr)))}
      >
        X²
      </ToolButton>
      <ToolButton
        className="supsubscript"
        isActive={isSub(editorState)}
        onClick={() => toggleSub(editorState, (tr) => setEditorState(editorState.apply(tr)))}
      >
        X₂
      </ToolButton>
      <span className="separator" />
      {schemaConfig.map((config) => (
        <ToolButton
          key={config.title}
          className="bold"
          isActive={false}
          onClick={() => config.handleSchemaInsert(editorState, setEditorState)}
        >
          <div>
            <img alt={config.title} src={config.icon} width="19" height="19" />
          </div>
        </ToolButton>
      ))}
      <span className="separator" />
      <select className="select-box" onChange={handleFontSizeChange} value={deriveFontSize(editorState)}>
        {fontSizes.map((size) => (
          <option key={size} value={`${size}px`}>
            {size}
          </option>
        ))}
      </select>
      <select className="select-box" onChange={handleFontTypeChange} value={deriveFontType(editorState)}>
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
        <option value="Verdana">Verdana</option>
      </select>
    </div>
  );
};

export default ToolsBar;
