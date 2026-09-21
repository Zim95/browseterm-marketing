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

```
index.html          Home page
install/macos.html  macOS installation guide
install/windows.html  Windows installation guide
install/linux.html  Headless Linux installation guide
security.html       Security overview
faq.html             FAQ
assets/styles.css   Shared stylesheet
assets/app.js       Small client-side conveniences (nav highlighting, copy-to-clipboard) - no network calls
assets/images/      Static images (currently empty)
_headers             Cloudflare Pages response headers (CSP, etc.)
_redirects            Cloudflare Pages redirects (deliberately no root redirect - see the file's own comment)
```

Download links throughout the install pages are placeholders (`#download-placeholder`, marked
with `<!-- TODO -->` comments) until real signed release artifacts exist. Update those hrefs once
release URLs are available - do not point them at anything else in the meantime.

## Local preview

No build step. Serve the directory with any static file server, e.g.:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploying to Cloudflare Pages

1. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git** and
   select this repository (`Zim95/browseterm-marketing`).
2. Build settings:
   - **Framework preset:** None
   - **Build command:** (leave empty - there is no build step)
   - **Build output directory:** `/` (repository root)
3. Deploy. Cloudflare Pages automatically picks up `_headers` and `_redirects` from the repo
   root.

## Custom domain setup (`browseterm.puhtaeto.com`)

**Claude must not perform this step.** DNS changes for `puhtaeto.com` require the domain owner's
direct action. This section documents exactly what a human needs to do.

1. In the Cloudflare Pages project's **Custom domains** tab, add `browseterm.puhtaeto.com`.
2. Cloudflare will show the exact DNS record to create. If `puhtaeto.com`'s DNS is already
   managed by Cloudflare, it offers to add the record automatically (a `CNAME` record for
   `browseterm` pointing at the Pages project's `*.pages.dev` hostname) - review and approve it,
   don't apply it blindly.
3. If `puhtaeto.com`'s DNS is NOT yet on Cloudflare, add manually at whichever registrar/DNS
   provider is authoritative:
   - **Type:** `CNAME`
   - **Name/Host:** `browseterm`
   - **Value/Target:** the `*.pages.dev` hostname Cloudflare Pages assigns this project (shown in
     the dashboard once the project is created - do not guess it in advance)
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
