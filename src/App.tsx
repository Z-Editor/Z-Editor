import 'prosemirror-view/style/prosemirror.css';
import 'prosemirror-menu/style/menu.css';
import './App.css';

import { baseKeymap } from 'prosemirror-commands';
import { history, redo, undo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { EditorState } from 'prosemirror-state';
import { useState } from 'react';

import { Editor, schema } from './components/Editor';
import Header from './components/Header';
import { toggleBold, toggleItalic } from './components/ToolsBar';
import ToolsBar from './components/ToolsBar/ToolsBar';

function App() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.create({
      schema,
      plugins: [
        history(),
        keymap({
          ...baseKeymap,
          'Mod-z': undo,
          'Mod-y': redo,
          'Mod-Shift-z': redo,
          'Mod-b': toggleBold,
          'Mod-i': toggleItalic,
        }),
      ],
    }),
  );

  const handleEditorChange = (newState: EditorState) => {
    console.log(newState.toJSON());
    setEditorState(newState);
  };

  return (
    <div className="App">
      <Header />
      <ToolsBar editorState={editorState} setEditorState={setEditorState} />
      <Editor className="page" state={editorState} onChange={handleEditorChange} />
    </div>
  );
}

export default App;
