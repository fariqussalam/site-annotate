# Contributing

Thanks for considering a contribution!

## Issues

- Bug reports: include browser version and steps to reproduce.
- Feature requests: describe the use case, not just the solution.

## Pull requests

1. Fork the repo and create a branch: `fix/description` or `feat/description`.
2. Make your changes. Keep the diff minimal.
3. Run `npm run build` and verify `dist/annotator.js` still works.
4. Open a PR with a clear description. add video evidence if possible to show testing result.

## Development setup

```bash
npm install
npm run build
```

Then open `demo/index.html` in your browser to test manually.
