// Client-side Google Drive integration (drive.file scope + Picker), no backend, no npm dep.
// Mirrors draw.io's approach: load Google's scripts on demand, use a token-model OAuth flow.
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const GIS_SRC = 'https://accounts.google.com/gsi/client';
const GAPI_SRC = 'https://apis.google.com/js/api.js';
const BOUNDARY = 'zeditor_multipart_boundary';

export const driveConfigured = Boolean(CLIENT_ID && API_KEY);

function ensureConfigured(): void {
  if (!driveConfigured) {
    throw new Error('Google Drive is not configured (missing VITE_GOOGLE_CLIENT_ID / VITE_GOOGLE_API_KEY).');
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

let tokenClient: GisTokenClient | null = null;
let cachedToken = '';
let tokenExpiry = 0;
let pendingResolve: ((token: string) => void) | null = null;
let pendingReject: ((err: Error) => void) | null = null;

async function getAccessToken(): Promise<string> {
  ensureConfigured();
  if (cachedToken && Date.now() < tokenExpiry - 60_000) {
    return cachedToken;
  }
  await loadScript(GIS_SRC);

  return new Promise<string>((resolve, reject) => {
    pendingResolve = resolve;
    pendingReject = reject;

    if (!tokenClient) {
      tokenClient = window.google!.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID!,
        scope: SCOPE,
        callback: (resp) => {
          if (resp.error || !resp.access_token) {
            pendingReject?.(new Error(resp.error ?? 'Authorization failed'));
            return;
          }
          cachedToken = resp.access_token;
          tokenExpiry = Date.now() + (resp.expires_in ?? 3600) * 1000;
          pendingResolve?.(cachedToken);
        },
        error_callback: (err) => pendingReject?.(new Error(err.type ?? 'Authorization cancelled')),
      });
    }

    // Silent once granted; prompt for consent on first use.
    tokenClient.requestAccessToken({ prompt: cachedToken ? '' : 'consent' });
  });
}

export function buildMultipartBody(metadata: { name: string; mimeType: string }, content: string): string {
  const delimiter = `\r\n--${BOUNDARY}\r\n`;
  const closeDelimiter = `\r\n--${BOUNDARY}--`;
  return (
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    content +
    closeDelimiter
  );
}

/** Create a new file (no id) or overwrite an existing one. Returns the file id. */
export async function saveFile(name: string, content: string, fileId?: string): Promise<string> {
  const token = await getAccessToken();
  const filename = name.endsWith('.z') ? name : `${name}.z`;
  const body = buildMultipartBody({ name: filename, mimeType: 'application/json' }, content);

  const base = 'https://www.googleapis.com/upload/drive/v3/files';
  const url = fileId ? `${base}/${fileId}?uploadType=multipart&fields=id` : `${base}?uploadType=multipart&fields=id`;

  const res = await fetch(url, {
    method: fileId ? 'PATCH' : 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${BOUNDARY}`,
    },
    body,
  });
  if (!res.ok) {
    throw new Error(`Drive save failed (${res.status})`);
  }
  const data = (await res.json()) as { id: string };
  return data.id;
}

export async function downloadFile(id: string): Promise<string> {
  const token = await getAccessToken();
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Drive download failed (${res.status})`);
  }
  return res.text();
}

/** Show the Google Picker; resolves with the chosen file or null if cancelled. */
export async function pickFile(): Promise<PickerDoc | null> {
  const token = await getAccessToken();
  await loadScript(GAPI_SRC);
  await new Promise<void>((resolve) => window.gapi!.load('picker', () => resolve()));

  return new Promise<PickerDoc | null>((resolve) => {
    const picker = window.google!.picker;
    const view = new picker.DocsView(picker.ViewId.DOCS).setMimeTypes('application/json').setSelectFolderEnabled(false);
    new picker.PickerBuilder()
      .setOAuthToken(token)
      .setDeveloperKey(API_KEY!)
      .addView(view)
      .setCallback((data) => {
        if (data.action === 'picked' && data.docs?.[0]) {
          resolve({ id: data.docs[0].id, name: data.docs[0].name });
        } else if (data.action === 'cancel') {
          resolve(null);
        }
      })
      .build()
      .setVisible(true);
  });
}
