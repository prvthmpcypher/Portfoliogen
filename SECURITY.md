# Security Baseline

PortfolioGen is currently a static, browser-only application. There is no server-side authentication system, session store, password database, private API, AI endpoint, or project database in this repository. Do not add secrets to frontend HTML, CSS, JavaScript, generated ZIPs, or `config.json`.

## Current Static Controls

- User text is HTML-escaped before generated markup is written.
- User-provided external links are restricted to `http://` and `https://`.
- User-provided emails are validated before `mailto:` links are emitted.
- Uploaded portfolio images are limited to JPG, PNG, or WebP and resized in-browser.
- Uploaded favicons are limited to PNG or ICO; user-supplied SVG favicons are rejected to avoid active SVG/script content.
- Generated pages include a restrictive CSP, `object-src 'none'`, `frame-ancestors 'none'`, and referrer controls.
- Host-level headers are defined in `_headers` for platforms that support that file, and generated ZIP exports include their own `_headers` file.

## If A Backend Is Added

Authentication and data access must be enforced on the server. Frontend validation is only a usability layer.

- Hash passwords with Argon2id or bcrypt with strong cost settings; never store plaintext or reversible passwords.
- Use server-only session cookies with `HttpOnly`, `Secure`, `SameSite=Lax` or stricter, absolute expiry, idle timeout, rotation after login, and logout invalidation.
- Require email verification before account features are enabled.
- Store password reset tokens hashed server-side, single-use, and expiring in 15-60 minutes.
- Rate limit login, signup, password reset, API endpoints, and AI generation by IP, account, and device fingerprint where appropriate.
- Keep API keys, database URLs, signing keys, service-role keys, and AI provider keys in server environment variables or a managed secret store.
- Never expose service-role database keys, JWT signing secrets, or provider API keys to frontend code.
- Enforce authorization in every query with `WHERE owner_id = authenticated_user_id`; check ownership before reading, updating, or deleting resources.
- Prefer database row-level security where available, but keep explicit server-side ownership checks too.
- Use parameterized queries or an ORM query builder; never concatenate user input into SQL or shell commands.
- Validate all request bodies, query parameters, file names, file types, and file sizes with strict schemas.
- Store uploads outside executable paths, scan/normalize metadata where possible, and serve them with safe content types.
- Log authentication attempts, authorization failures, API errors, rate-limit events, and unusual traffic patterns without logging secrets or raw passwords.
- Keep the database private to the backend network; do not expose direct database access to the public internet.
- Enforce HTTPS at the edge, redirect HTTP to HTTPS, and enable HSTS after confirming HTTPS is stable.
