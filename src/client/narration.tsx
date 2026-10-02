import { createElement } from 'react';
import type { AssistantChatData, ChatConversationViewNode } from '@deepseek-ai/dsh-client-ui-chat/client';
import { progressSegments } from './native/progress-protocol.js';

/** Legacy collector retained for source compatibility. Reader no longer mounts
 * this top aggregation; public-text seats are projected in live-turn.ts. */
export function readerNarrations(keys: readonly string[], nodes: ReadonlyMap<string, ChatConversationViewNode>) {
  const items: {key: string; text: string}[] = [];
  for (const key of keys) {
    const node = nodes.get(key);
    if (!node || node.visibility === 'hidden' || node.kind !== 'assistant-step') continue;
    for (const part of progressSegments((node.data as AssistantChatData).blocks)) {
      if (part.kind === 'progress') items.push({key: `${key}:${part.start}:${part.offset}`, text: part.progressText});
    }
  }
  return items;
}

export function ReaderNarrations({items}: {items: ReturnType<typeof readerNarrations>}) {
  if (!items.length) return null;
  return createElement('div', {'data-reader-narrations': true}, items.map(item =>
    createElement('div', {key: item.key, 'data-reader-progress': item.key, style: {
      color: 'var(--dsw-alias-label-secondary, #aaa)',
      fontSize: 'var(--dsh-progress-font-size, .875rem)', fontWeight: 400,
      lineHeight: 1.7, margin: '6px 0', padding: 0, border: 0, background: 'none',
      overflowWrap: 'anywhere', whiteSpace: 'pre-wrap',
    }}, item.text)));
}
