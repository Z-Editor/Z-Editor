import './ToolsBar.css';

import { MarkType } from 'prosemirror-model';
import { EditorState, TextSelection } from 'prosemirror-state';
import { ComponentType } from 'react';

import schemaFull from '../../assets/full.svg';
import schemaHalf from '../../assets/half.svg';
import schemaInverse from '../../assets/inverse.svg';
import { schema } from '../Editor/schema';
import { ToolButton } from '../ToolButton';
import { toggleBold, toggleItalic } from './commands';

function isBold(state: EditorState): boolean {
  return isMarkActive(state, schema.marks.strong);
}

function isItalic(state: EditorState): boolean {
  return isMarkActive(state, schema.marks.em);
}

// https://github.com/ProseMirror/prosemirror-example-setup/blob/afbc42a68803a57af3f29dd93c3c522c30ea3ed6/src/menu.js#L57-L61
function isMarkActive(state: EditorState, mark: MarkType): boolean {
  const { from, $from, to, empty } = state.selection;
  return empty ? !!mark.isInSet(state.storedMarks ?? $from.marks()) : state.doc.rangeHasMark(from, to, mark);
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

interface ToolsBarProps {
  editorState: EditorState;
  setEditorState: (editorState: EditorState) => void;
}

const ToolsBar: ComponentType<ToolsBarProps> = ({ editorState, setEditorState }) => {
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
    </div>
  );
};

export default ToolsBar;
