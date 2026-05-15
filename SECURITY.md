# Security Policy

## Supported Versions

Only the latest version on the `main` branch is supported.

## Reporting a Vulnerability

If you discover a security issue, please email the maintainer directly rather than opening a public issue.

**Email:** fariq.mdaq@gmail.com

We will acknowledge within 48 hours and aim to resolve critical issues within 7 days.

## What we check

- `npm audit` runs on every push and weekly via GitHub Actions
- `dist/annotator.js` is built from source and committed — always verify the source in `src/annotator.ts`
- No external runtime dependencies (zero-dependency widget)

## Best practices for users

- Always load the script from a trusted source (your own domain or the official repo)
- Verify the script hash if loading from a CDN
- The widget uses `localStorage` only — no data is sent to external servers
