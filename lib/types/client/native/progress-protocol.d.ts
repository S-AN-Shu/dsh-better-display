/** Canonical progress-line parser. Offsets refer to the unchanged source string. */
export declare const PROGRESS_MARKER = "\uD83D\uDCCC";
export declare const PROTOCOL_VERSION = 1;
export declare const PUBLIC_TEXT_VERSION = 1;
export declare function scanProgressSpans(text: any): {
    kind: string;
    start: number;
    end: number;
    text: string;
}[];
export declare function hasProgressLine(text: any): boolean;
/** Public projection for Host and views. Keys use source start/offset, never kind,
 * end or current text. Empty text is excluded before a view creates layout seats.
 * Host blocks use type; view blocks use kind. Unknown/media blocks survive. */
/** @param {readonly any[]} blocks */
export declare function publicTextSegments(blocks: any): {
    kind: string;
    start: number;
    offset: number;
    end: any;
    blocks: any[];
    public: boolean;
    renderable: boolean;
}[];
/** Shared Reader/Host/client source segmentation. Adjacent text blocks share context. */
export declare function progressSegments(blocks: any): any[];
/** Remove only recognized progress spans, preserving every original non-text block. */
export declare function withoutProgress(blocks: any): any[];
//# sourceMappingURL=progress-protocol.d.ts.map