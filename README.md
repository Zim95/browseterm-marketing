# browseterm-marketing

The public marketing and installation website for Browseterm, served at
`https://browseterm.puhtaeto.com`.

Static HTML/CSS/JS only. No login form, no application session, no API calls, no build step.
The Browseterm Cloud UI/API is a completely separate application at
`https://app.browseterm.puhtaeto.com` (repository: `browseterm-server`) — this site never talks
to it directly; every reference to it is a plain link.

See `BROWSETERM_CLOUD_CONTROL_PLANE_MIGRATION.md` Part 2 in the main workspace for the
requirements this repo implements.

## Structure

All website files live under `public/` - this is the actual deployed asset directory. Nothing
outside `public/` (this README, `LICENSE`, `wrangler.jsonc`, `.git`) is ever uploaded; the whole
point of the `public/` split is to make that structurally impossible rather than dependent on a
deploy-tool setting being configured correctly.

```
public/
├── index.html          Home page
├── install/macos.html  macOS installation guide
├── install/windows.html  Windows installation guide
├── install/linux.html  Headless Linux installation guide
├── security.html       Security overview
├── faq.html             FAQ
├── assets/styles.css   Shared stylesheet
├── assets/app.js       Small client-side conveniences (nav highlighting, copy-to-clipboard) - no network calls
├── assets/images/      Static images (currently empty)
├── _headers             Response headers (CSP, etc.) - Cloudflare applies this from the assets root
└── _redirects            Redirects (deliberately no root redirect - see the file's own comment)
wrangler.jsonc            Cloudflare Workers config - assets.directory points at ./public
```

Download links throughout the install pages are placeholders (`#download-placeholder`, marked
with `<!-- TODO -->` comments) until real signed release artifacts exist. Update those hrefs once
release URLs are available - do not point them at anything else in the meantime.

## Local preview

No build step. Serve the `public/` directory with any static file server, e.g.:

```bash
python3 -m http.server 8000 --directory public
```

Then open `http://localhost:8000`. Or use Wrangler's own dev server (matches production routing
exactly, including `_headers`/`_redirects`):

```bash
npx wrangler dev
```

## Deploying (Cloudflare Workers static assets)

This project deploys as a Worker with static assets (`wrangler.jsonc`'s `assets.directory:
"./public"`), not a Pages Git-connected project - `public/` is the ONLY directory ever uploaded,
by construction, regardless of what else is sitting in the repo root.

```bash
npx wrangler deploy
```

Sanity-check any config change before deploying for real:

```bash
npx wrangler deploy --dry-run    # prints the file count/size that would upload
find public -type f | sort       # cross-check against what's actually in the assets dir
```

After deploying, confirm nothing outside `public/` is reachable, e.g.
`curl -I https://<deployed-host>/.git/config` and `curl -I https://<deployed-host>/README.md`
should both return `404`.

## Custom domain setup (`browseterm.puhtaeto.com`)

**Claude must not perform this step.** DNS changes for `puhtaeto.com` require the domain owner's
direct action. This section documents exactly what a human needs to do.

1. In the Cloudflare dashboard, open this Worker (**Workers & Pages → browseterm-marketing**) and
   go to its **Settings → Domains & Routes** (or **Triggers → Custom Domains**, depending on
   dashboard version), and add `browseterm.puhtaeto.com`.
2. Cloudflare will show the exact DNS record to create. If `puhtaeto.com`'s DNS is already
   managed by Cloudflare, it offers to add the record automatically - review and approve it,
   don't apply it blindly.
3. If `puhtaeto.com`'s DNS is NOT yet on Cloudflare, add manually at whichever registrar/DNS
   provider is authoritative, using the exact target Cloudflare's dashboard shows for this Worker
   once the custom domain is added there (do not guess it in advance).
   - **Proxy status:** Proxied (orange cloud), if the DNS provider is Cloudflare itself
4. Do **not** point `browseterm.puhtaeto.com` at `app.browseterm.puhtaeto.com` or at the Contabo
   ingress IP used by `browseterm-server` - they are two independent applications with two
   independent hostnames, per the migration doc's fixed domain decisions.
5. Wait for DNS propagation and for Cloudflare to issue a TLS certificate for the custom domain
   (automatic, no action needed once the DNS record resolves correctly).
6. Verify `https://browseterm.puhtaeto.com` loads this site, and that
   `https://app.browseterm.puhtaeto.com` (a separate deployment) is unaffected.

## License

See `LICENSE`.
