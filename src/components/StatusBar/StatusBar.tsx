import './StatusBar.css';

import { EditorState } from 'prosemirror-state';
import { ComponentType } from 'react';

interface StatusBarProps {
  editorState: EditorState;
}

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

const StatusBar: ComponentType<StatusBarProps> = ({ editorState }) => {
  const { doc } = editorState;
  const text = doc.textContent;
  const words = countWords(doc.textBetween(0, doc.content.size, ' ', ' '));

  return (
    <div className="statusbar">
      <span className="statusbar-item">
        {words} {words === 1 ? 'word' : 'words'}
      </span>
      <span className="statusbar-item">{text.length} characters</span>
    </div>
  );
};

export default StatusBar;
