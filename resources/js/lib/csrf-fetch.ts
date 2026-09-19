/**
 * Sends application mutations through the browser origin that rendered the
 * Inertia page. This prevents a localhost/127.0.0.1 Ziggy URL from splitting
 * the Laravel session cookie while keeping Laravel's CSRF verification active.
 */
export function csrfFetch(input: RequestInfo | URL, init: RequestInit = {}) {
    const original = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const parsed = new URL(original, window.location.origin);
    const localHosts = new Set(['localhost', '127.0.0.1', '[::1]']);
    const isLocalAppUrl = localHosts.has(parsed.hostname) && localHosts.has(window.location.hostname);
    const url = isLocalAppUrl && parsed.origin !== window.location.origin
        ? `${parsed.pathname}${parsed.search}${parsed.hash}`
        : original;
    const headers = new Headers(init.headers);
    const method = (init.method ?? (typeof input === 'object' && 'method' in input ? input.method : 'GET')).toUpperCase();

    if (!['GET', 'HEAD', 'OPTIONS'].includes(method) && !headers.has('X-CSRF-TOKEN')) {
        const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
        if (token) headers.set('X-CSRF-TOKEN', token);
    }

    return fetch(url, { ...init, headers, credentials: init.credentials ?? 'same-origin' });
}
