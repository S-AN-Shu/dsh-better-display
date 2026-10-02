/** Web or Desktop file route. Authorization stays Host-side. */
export function localPathMediaUrl(protocol, origin, value) {
    const absolutePath = (value.startsWith('/') && !value.startsWith('//')) || /^[a-z]:[\\/]/i.test(value);
    if (!absolutePath)
        return undefined;
    if (protocol === 'http:' || protocol === 'https:') {
        return `${origin}/api/file?path=${encodeURIComponent(value)}`;
    }
    // Official fileMediaUrl accepts the Desktop application base dsh-app://app/.
    if (protocol === 'dsh-app:' && origin === 'dsh-app://app') {
        return `dsh-app://app/api/file?path=${encodeURIComponent(value)}`;
    }
    return undefined;
}
export const readerPathImages = {
    resolve: (value) => typeof window === 'undefined' ? undefined
        : localPathMediaUrl(window.location.protocol, window.location.origin, value),
};
//# sourceMappingURL=platform-media.js.map