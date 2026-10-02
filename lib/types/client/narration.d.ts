import type { ChatConversationViewNode } from '@deepseek-ai/dsh-client-ui-chat/client';
/** Legacy collector retained for source compatibility. Reader no longer mounts
 * this top aggregation; public-text seats are projected in live-turn.ts. */
export declare function readerNarrations(keys: readonly string[], nodes: ReadonlyMap<string, ChatConversationViewNode>): {
    key: string;
    text: string;
}[];
export declare function ReaderNarrations({ items }: {
    items: ReturnType<typeof readerNarrations>;
}): import("react").ReactElement<{
    'data-reader-narrations': boolean;
}, string | import("react").JSXElementConstructor<any>> | null;
//# sourceMappingURL=narration.d.ts.map