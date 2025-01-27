import './Header.css';

import { EditorState } from 'prosemirror-state';
import { ComponentType, useCallback, useRef } from 'react';

import { schema } from '../Editor';
import { HeaderButton } from '../HeaderButton';

interface HeaderProps {
  editorState: EditorState;
  setEditorState: (state: EditorState) => void;
}

const Header: ComponentType<HeaderProps> = ({ editorState, setEditorState }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file) {
        const text = await file.text();
        const savedState: unknown = JSON.parse(text);

        console.log(savedState);
        // Reconstruct the EditorState from saved JSON data
        const newState = EditorState.create({
          schema,
          plugins: editorState.plugins,
          doc: schema.nodeFromJSON(savedState),
        });

        setEditorState(newState);
      }
    },
    [editorState, setEditorState],
  );

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = (): void => {
    const stateJSON: unknown = editorState.doc.toJSON();
    const blob = new Blob([JSON.stringify(stateJSON)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Prompt the user to name the file
    const fileName = window.prompt('Enter the name for the download file', 'zeditor_download.z');
    if (!fileName) {
      // Exit if the user cancels or provides no name
      return;
    }

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.endsWith('.z') ? fileName : `${fileName}.z`; // Ensure proper file extension
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Free up the URL after download
    URL.revokeObjectURL(url);
  };

  return (
    <div className="header">
      <div className="logo">Z-Editor</div>
      <HeaderButton
        text="Print"
        onClick={() => {
          window.print();
        }}
      />
      <HeaderButton text="Download" onClick={handleDownload} />
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        accept=".z"
        onChange={(e) => {
          void (async () => {
            await handleFileChange(e);
          })();
        }}
      />
      <HeaderButton text="Import" onClick={triggerUpload} />
    </div>
  );
};

export default Header;
