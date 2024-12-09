import 'prosemirror-view/style/prosemirror.css';
import 'prosemirror-menu/style/menu.css';
import './App.css';

import { baseKeymap } from 'prosemirror-commands';
import { history, redo, undo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { EditorState } from 'prosemirror-state';
import { useRef, useState } from 'react';

import { Editor, schema } from './components/Editor';
import { Handle } from './components/Editor/Editor';
import Header from './components/Header';
import { SidePanel } from './components/SidePanel';
import { toggleBold, toggleItalic, toggleSub, toggleSup } from './components/ToolsBar';
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
          'Mod-Shift-S': toggleSup,
          'Mod-Shift-B': toggleSub,
        }),
      ],
    }),
  );
  const editorRef = useRef<Handle>(null);

  const handleEditorChange = (newState: EditorState) => {
    console.log(newState.toJSON());
    setEditorState(newState);
  };

  return (
    <div className="App">
      <Header editorState={editorState} setEditorState={setEditorState} />
      <ToolsBar editorState={editorState} setEditorState={setEditorState} />
      <Editor className="page" ref={editorRef} state={editorState} onChange={handleEditorChange} />
      <SidePanel editorState={editorState} setEditorState={setEditorState} editorRef={editorRef} />
    </div>
  );
}

export default App;
