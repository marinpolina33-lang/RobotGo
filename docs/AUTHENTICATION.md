# RobotGo accounts

The storefront remains on the existing Render static service. A dedicated Cloudflare Worker handles only `/api/auth/*` on robotgo.ro and www.robotgo.ro. Both existing Render DNS records are proxied; the registrar and nameservers are unchanged. Account records persist in Cloudflare D1 with EU jurisdiction.

## User flows

- `/#/account`: sign up, sign in, sign out, change password and recover using a one-time recovery code.
- Registration always creates a regular user. Email ownership is not verified; the interface does not claim verification or send email.
- The administrator uses the same form. The initial password must be replaced before the user-management panel is accessible. Admins can list, disable and re-enable regular accounts; disabling revokes all sessions.
- Recovery codes are shown once after registration/password change/recovery and must be saved. Each new code invalidates the previous one. There is no automated email reset provider configured.
- Saved catalogue selections remain browser-local. This feature does not claim to manage catalogue content, payments or orders.

## Security

Passwords use salted scrypt (N=16384, r=8, p=5, 32-byte derived key), never plaintext. Server-side sessions store SHA-256 digests of random 256-bit tokens. The browser receives only a Secure, HttpOnly, SameSite=Strict, host-only cookie. Sessions expire after 12 hours for users and 2 hours for admins. Password changes/recovery revoke existing sessions. The API enforces roles independently of the UI, exact trusted origins, JSON/custom-header mutation requests, body size limits, prepared SQL, and persistent IP/account rate limiting. Authentication responses are never cached. Logs exclude request bodies and credentials.

## Deployment and validation

- `node --test tests/auth/auth.test.mjs`: auth integration tests with SQLite.
- `node tools/build.mjs`: storefront and SEO checks/build.
- Frontend changes on main deploy to the existing Render service.
- Worker source and configuration: `auth/worker.mjs`, `auth/wrangler.jsonc`. Deploy with the connected Cloudflare API or `npx wrangler deploy --config auth/wrangler.jsonc` in an authenticated environment. Deploying frontend on Render does not deploy Worker code.
- Apply additive schema changes through the connected D1 API. Do not recreate the database or seed duplicate admin accounts.
- A daily cleanup schedule removes expired sessions/rate-limit counters. A low-frequency request cleanup is also present.
- Check `/api/auth/health`, registration, login, logout, session revocation, recovery, admin permissions and mobile UI after a release.

Credentials are not stored in this repository or in public site configuration. The initial administrator credential is delivered privately to the owner and is forced to change on first use.
