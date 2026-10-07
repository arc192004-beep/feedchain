/**
 * Sends application mutations through the browser origin that rendered the
 * Inertia page. This prevents a localhost/127.0.0.1 Ziggy URL from splitting
 * the Laravel session cookie while keeping Laravel's CSRF verification active.
 *
 * Token source (in priority order):
 *  1. XSRF-TOKEN cookie — Laravel refreshes this on every response, including
 *     after session regeneration on login. It is NOT http_only so JS can read it.
 *     This is ALWAYS the freshest source and will overwrite any stale value the
 *     caller pre-set from the meta tag.
 *  2. meta[name="csrf-token"] — written once on initial page load; becomes stale
 *     after session regeneration. Used only if the cookie is absent.
 *
 * IMPORTANT: This function deliberately OVERWRITES any X-CSRF-TOKEN header the
 * caller already set. Components across this codebase read the meta tag and pass
 * it explicitly; after login that value is stale (419). The cookie is authoritative.
 */
function getXsrfCookie(): string | null {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
    if (match) {
        try {
            return decodeURIComponent(match[1]);
        } catch {
            return match[1];
        }
    }
    return null;
}

function getMetaCsrfToken(): string | null {
    return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? null;
}

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

    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        const xsrfCookie = getXsrfCookie();
        if (xsrfCookie) {
            headers.set('X-XSRF-TOKEN', xsrfCookie);
            headers.delete('X-CSRF-TOKEN');
        } else {
            const metaToken = getMetaCsrfToken();
            if (metaToken) {
                headers.set('X-CSRF-TOKEN', metaToken);
            }
        }
    }

    return fetch(url, { ...init, headers, credentials: init.credentials ?? 'same-origin' });
}
