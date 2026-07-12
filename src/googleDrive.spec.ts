import { describe, expect, it } from 'vitest';

import { buildMultipartBody } from './googleDrive';

describe('buildMultipartBody', () => {
  const metadata = { name: 'notes.z', mimeType: 'application/json' };
  const content = '{"type":"doc"}';
  const body = buildMultipartBody(metadata, content);

  it('embeds the metadata as JSON', () => {
    expect(body).toContain(JSON.stringify(metadata));
  });

  it('embeds the file content', () => {
    expect(body).toContain(content);
  });

  it('opens and closes with the multipart boundary', () => {
    const boundaryCount = (body.match(/--zeditor_multipart_boundary/g) ?? []).length;
    // two part delimiters + one closing delimiter
    expect(boundaryCount).toBe(3);
    expect(body.trimEnd().endsWith('--zeditor_multipart_boundary--')).toBe(true);
  });

  it('declares both parts as application/json', () => {
    const jsonHeaders = (body.match(/Content-Type: application\/json/g) ?? []).length;
    expect(jsonHeaders).toBe(2);
  });
});
