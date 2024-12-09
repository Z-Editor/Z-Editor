import './SidePanel.css';

import { EditorState } from 'prosemirror-state';
import { ComponentType } from 'react';

import { Handle } from '../Editor/Editor';
import { sideBarSymbols } from './constants';

interface SidePanelProps {
  editorState: EditorState;
  setEditorState: (editorState: EditorState) => void;
  editorRef: React.RefObject<Handle>;
}

const SidePanel: ComponentType<SidePanelProps> = ({ editorState, setEditorState, editorRef }) => {
  const handleSymbolClick = (symbol: string) => {
    const { tr, selection } = editorState;
    const { from, to } = selection;

    tr.insertText(symbol, from, to);
    setEditorState(editorState.apply(tr));
    editorRef.current?.view?.focus();
  };

  return (
    <div className="side-panel">
      {sideBarSymbols.map((section, index) => (
        <div className="symbol-section" key={index}>
          {section.data.map((symbol, index) => (
            <div className="symbol" key={index} onClick={() => handleSymbolClick(symbol.symbol)}>
              {symbol.symbol}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SidePanel;
