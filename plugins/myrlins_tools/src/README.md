# Myrlin's Tools: source

The TypeScript source of `../myrlins_tools.js`, bundled with esbuild 0.20.2:

```
npm install
npm run build
```

`npm run build` writes `../myrlins_tools.js` with `--define:MYRLIN_STORE_EDITION=true --minify-syntax`. That is the edition for
this repository. Every guard tests `MYRLIN_STORE_EDITION === true` in place (see `edition.d.ts`), so esbuild removes the code
behind it: the Myrlin Model Browser (`ui/browser.ts`), the export dialogs that convert formats on Myrlin's server
(`features/export_dialog.ts`, `features/dual_export.ts`), the Auto Repair panel and every request in `api-client.ts`. Those files
stay here because they are the source of the same plugin hosted on forge.myrlin.io; none of their code is in the built file,
which makes no network request.
