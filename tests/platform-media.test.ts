import test from 'node:test';
import assert from 'node:assert/strict';
import { localPathMediaUrl } from '../src/client/platform-media.js';

test('absolute local image paths use the authenticated Host file API without losing authored bytes', () => {
  for (const path of ['/tmp/a.png', '/tmp/中文 图 #1.png', '/tmp/a%20b.png', '/tmp/a?x=1&y=2.png']) {
    const url = localPathMediaUrl('http:', 'http://127.0.0.1:43127', path)!;
    assert.equal(new URL(url).pathname, '/api/file');
    assert.equal(new URL(url).searchParams.get('path'), path);
  }
});
test('relative, protocol-relative and non-HTTP page paths are not sent to the Host file API', () => {
  for (const path of ['', 'relative.png', '//host/image.png', 'https://host/image.png', 'data:image/png,x', 'javascript:alert(1)']) {
    assert.equal(localPathMediaUrl('http:', 'http://local', path), undefined);
  }
  assert.equal(localPathMediaUrl('file:', 'null', '/tmp/image.png'), undefined);
  assert.equal(localPathMediaUrl('dsh-app:', 'dsh-app://other', '/tmp/image.png'), undefined);
});
test('Desktop file routes use the application file API', () => {
  const url = localPathMediaUrl('dsh-app:', 'dsh-app://app', '/tmp/a.png')!;
  assert.equal(url.startsWith('dsh-app://app/api/file?'), true);
  assert.equal(new URL(url).searchParams.get('path'), '/tmp/a.png');
});

// Windows drive paths are local file references, not URL schemes.
test('Windows drive image paths retain authored bytes on Web and Desktop', () => {
  for (const path of [String.raw`C:\Users\19161\图片.png`, 'C:/Users/19161/图片.png', String.raw`D:\中文 空格\图 #1%20?&.png`]) {
    for (const [protocol, origin] of [['http:', 'http://local'], ['https:', 'https://local'], ['dsh-app:', 'dsh-app://app']]) {
      const url = localPathMediaUrl(protocol!, origin!, path);
      assert.ok(url);
      assert.equal(new URL(url).searchParams.get('path'), path);
    }
  }
  assert.equal(localPathMediaUrl('http:', 'http://local', 'C:relative.png'), undefined);
});
