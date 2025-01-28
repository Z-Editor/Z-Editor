import './SidePanel.css';

import { EditorState } from 'prosemirror-state';
import { ComponentType, useState } from 'react';

import { Handle } from '../Editor/Editor';
import { sideBarSymbols } from './constants';

interface SidePanelProps {
  editorState: EditorState;
  setEditorState: (editorState: EditorState) => void;
  editorRef: React.RefObject<Handle>;
}

const SidePanel: ComponentType<SidePanelProps> = ({ editorState, setEditorState, editorRef }) => {
  const [shouldCollapse, setCollapse] = useState<boolean>(true);

  const handleSymbolClick = (symbol: string) => {
    const { tr, selection } = editorState;
    const { from, to } = selection;

    tr.insertText(symbol, from, to);
    setEditorState(editorState.apply(tr));
    editorRef.current?.view?.focus();
  };

  const toggleCollapse = () => {
    setCollapse(!shouldCollapse);
  };

  return (
    <>
      {shouldCollapse ? (
        <div className="collapsed-side-bar">
          <button className="toggle-collapse-button" onClick={toggleCollapse}>
            {'<<'}
          </button>
        </div>
      ) : (
        <div className="side-panel">
          <button className="toggle-collapse-button" onClick={toggleCollapse}>
            {'>>'}
          </button>

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
      )}
    </>
  );
};

export default SidePanel;
