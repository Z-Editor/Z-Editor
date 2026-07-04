import 'prosemirror-view/style/prosemirror.css';
import './App.css';

import { baseKeymap, splitBlockKeepMarks } from 'prosemirror-commands';
import { history, redo, undo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { EditorState } from 'prosemirror-state';
import { useRef, useState } from 'react';

import { Editor, schema } from './components/Editor';
import { Handle } from './components/Editor/Editor';
import Header from './components/Header';
import { SidePanel } from './components/SidePanel';
import StatusBar from './components/StatusBar';
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
          Enter: splitBlockKeepMarks,
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
  const [docName, setDocName] = useState('Untitled document');
  const editorRef = useRef<Handle>(null);

  const handleEditorChange = (newState: EditorState) => {
    setEditorState(newState);
  };

  return (
    <div className="app-shell">
      <Header editorState={editorState} setEditorState={setEditorState} docName={docName} setDocName={setDocName} />
      <ToolsBar editorState={editorState} setEditorState={setEditorState} editorRef={editorRef} />
      <div className="workspace">
        <main className="canvas">
          <Editor className="page" ref={editorRef} state={editorState} onChange={handleEditorChange} />
        </main>
        <SidePanel editorState={editorState} setEditorState={setEditorState} editorRef={editorRef} />
      </div>
      <StatusBar editorState={editorState} />
    </div>
  );
}

export default App;
