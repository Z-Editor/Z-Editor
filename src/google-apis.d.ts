// Minimal ambient types for the Google Identity Services + Picker globals we use.
interface GisTokenResponse {
  access_token?: string;
  expires_in?: number;
  error?: string;
}

interface GisTokenClient {
  callback: (resp: GisTokenResponse) => void;
  requestAccessToken: (options?: { prompt?: string }) => void;
}

interface GisTokenClientConfig {
  client_id: string;
  scope: string;
  callback: (resp: GisTokenResponse) => void;
  error_callback?: (err: { type?: string }) => void;
}

interface PickerDoc {
  id: string;
  name: string;
}

interface PickerCallbackData {
  action: string;
  docs?: PickerDoc[];
}

interface PickerDocsView {
  setMimeTypes(mimeTypes: string): PickerDocsView;
  setSelectFolderEnabled(enabled: boolean): PickerDocsView;
}

interface PickerInstance {
  setVisible(visible: boolean): void;
}

interface PickerBuilderInstance {
  setOAuthToken(token: string): PickerBuilderInstance;
  setDeveloperKey(key: string): PickerBuilderInstance;
  addView(view: PickerDocsView): PickerBuilderInstance;
  setCallback(cb: (data: PickerCallbackData) => void): PickerBuilderInstance;
  build(): PickerInstance;
}

interface GooglePickerNamespace {
  PickerBuilder: new () => PickerBuilderInstance;
  DocsView: new (viewId?: unknown) => PickerDocsView;
  ViewId: { DOCS: unknown };
}

interface GoogleNamespace {
  accounts: {
    oauth2: {
      initTokenClient(config: GisTokenClientConfig): GisTokenClient;
    };
  };
  picker: GooglePickerNamespace;
}

interface GapiNamespace {
  load(library: string, callback: () => void): void;
}

interface Window {
  google?: GoogleNamespace;
  gapi?: GapiNamespace;
}
