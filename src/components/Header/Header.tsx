import './Header.css';

import html2canvas from 'html2canvas';
import { EditorState } from 'prosemirror-state';
import { ComponentType, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { track } from '../../analytics';
import { downloadFile, driveConfigured, pickFile, saveFile } from '../../googleDrive';
import { DropDownMenu } from '../DropDownMenu';
import { schema } from '../Editor';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface HeaderProps {
  editorState: EditorState;
  setEditorState: (state: EditorState) => void;
  docName: string;
  setDocName: (name: string) => void;
}

function sanitizeBase(name: string, fallback: string): string {
  const trimmed = name.trim();
  return trimmed ? trimmed : fallback;
}

const Header: ComponentType<HeaderProps> = ({ editorState, setEditorState, docName, setDocName }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [driveFileId, setDriveFileId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Refs keep the autosave interval reading the latest values without resetting each keystroke.
  const currentContent = useMemo(() => JSON.stringify(editorState.doc.toJSON()), [editorState]);
  const contentRef = useRef(currentContent);
  contentRef.current = currentContent;
  const docNameRef = useRef(docName);
  docNameRef.current = docName;
  const driveFileIdRef = useRef<string | null>(null);
  const lastSavedRef = useRef('');
  const savingRef = useRef(false);

  useEffect(() => {
    driveFileIdRef.current = driveFileId;
  }, [driveFileId]);

  const pushToDrive = useCallback(async (): Promise<void> => {
    savingRef.current = true;
    setSaveStatus('saving');
    try {
      const content = contentRef.current;
      const id = await saveFile(docNameRef.current, content, driveFileIdRef.current ?? undefined);
      driveFileIdRef.current = id;
      setDriveFileId(id);
      lastSavedRef.current = content;
      setSaveStatus('saved');
    } finally {
      savingRef.current = false;
    }
  }, []);

  const openFromDrive = useCallback(async (): Promise<void> => {
    try {
      const picked = await pickFile();
      if (!picked) return;
      const text = await downloadFile(picked.id);
      const savedState: unknown = JSON.parse(text);
      const newState = EditorState.create({
        schema,
        plugins: editorState.plugins,
        doc: schema.nodeFromJSON(savedState),
      });
      setEditorState(newState);
      setDocName(picked.name.replace(/\.z$/i, ''));
      lastSavedRef.current = JSON.stringify(newState.doc.toJSON());
      setDriveFileId(picked.id);
      setSaveStatus('saved');
      track('drive_open');
    } catch (err) {
      alert(`Could not open from Google Drive: ${(err as Error).message}`);
    }
  }, [editorState.plugins, setEditorState, setDocName]);

  const saveToDrive = useCallback(async (): Promise<void> => {
    try {
      await pushToDrive();
      track('drive_save');
    } catch (err) {
      setSaveStatus('error');
      alert(`Could not save to Google Drive: ${(err as Error).message}`);
    }
  }, [pushToDrive]);

  // Autosave every 60s while the document is Drive-backed, only when it has unsaved changes.
  useEffect(() => {
    if (!driveFileId) return;
    const autosave = async () => {
      if (savingRef.current || contentRef.current === lastSavedRef.current) return;
      try {
        await pushToDrive();
        track('drive_autosave', { ok: true });
      } catch {
        setSaveStatus('error');
        track('drive_autosave', { ok: false });
      }
    };
    const interval = setInterval(() => void autosave(), 60_000);
    const onHide = () => {
      if (document.visibilityState === 'hidden') void autosave();
    };
    document.addEventListener('visibilitychange', onHide);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [driveFileId, pushToDrive]);

  const printAsPdf = useCallback(() => {
    // Chrome uses document.title as the default "Save as PDF" filename.
    const prev = document.title;
    document.title = sanitizeBase(docName, 'document');
    track('file_download_pdf');
    window.print();
    document.title = prev;
  }, [docName]);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file) {
        const text = await file.text();
        const savedState: unknown = JSON.parse(text);

        const newState = EditorState.create({
          schema,
          plugins: editorState.plugins,
          doc: schema.nodeFromJSON(savedState),
        });

        setEditorState(newState);
        setDocName(file.name.replace(/\.z$/i, ''));
        track('file_import');
      }
    },
    [editorState, setEditorState, setDocName],
  );

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = (): void => {
    const stateJSON: unknown = editorState.doc.toJSON();
    const blob = new Blob([JSON.stringify(stateJSON)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const base = sanitizeBase(docName, 'zeditor_download');
    const link = document.createElement('a');
    link.href = url;
    link.download = base.endsWith('.z') ? base : `${base}.z`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    track('file_download');
  };

  const exportAsPNG = async () => {
    const contentContainer = document.getElementById('content-container');
    if (!contentContainer) {
      return;
    }

    const canvas = await html2canvas(contentContainer, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    });

    const dataUrl = canvas.toDataURL('image/png');
    const base = sanitizeBase(docName, 'zeditor_export');
    const link = document.createElement('a');
    link.download = base.endsWith('.png') ? base : `${base}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    track('file_export_png');
  };

  return (
    <div className="topbar">
      <div className="titlebar">
        <div className="brand">Z-Editor</div>
        <input
          className="doc-title"
          value={docName}
          aria-label="Document name"
          onChange={(e) => setDocName(e.target.value)}
        />
        {driveFileId && (
          <span className="save-status" data-status={saveStatus}>
            {saveStatus === 'saving'
              ? 'Saving…'
              : saveStatus === 'error'
                ? 'Save failed — retrying'
                : 'All changes saved to Drive'}
          </span>
        )}
        <div className="header-actions">
          <a
            className="icon-link"
            href="https://github.com/Z-Editor/Z-Editor/issues/new/choose"
            target="_blank"
            rel="noopener noreferrer"
            title="Report a bug or request a feature"
            onClick={() => track('feedback_open')}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m8 2 1.88 1.88M14.12 3.88 16 2M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
              <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6zM12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-2.1 1.7-3.9 3.8-4M20.97 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4" />
            </svg>
            <span>Feedback</span>
          </a>
          <a
            className="icon-link"
            href="https://github.com/Z-Editor/Z-Editor"
            target="_blank"
            rel="noopener noreferrer"
            title="View source on GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.6 18 4.9 18 4.9c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
      <div className="menubar">
        <DropDownMenu
          text="File"
          options={[
            {
              label: 'Import',
              children: [
                { label: 'From device (.z)', onClick: triggerUpload },
                ...(driveConfigured ? [{ label: 'From Google Drive', onClick: () => void openFromDrive() }] : []),
              ],
            },
            {
              label: 'Save',
              children: [
                { label: 'To device (.z)', onClick: handleDownload },
                ...(driveConfigured ? [{ label: 'To Google Drive', onClick: () => void saveToDrive() }] : []),
              ],
            },
            { label: 'Download as PDF', onClick: printAsPdf },
            {
              label: 'Export as PNG',
              onClick: () => {
                void (async () => {
                  await exportAsPNG();
                })();
              },
            },
            {
              label: 'Print',
              onClick: () => {
                track('file_print');
                window.print();
              },
            },
          ]}
        />
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
      </div>
    </div>
  );
};

export default Header;
