# Starting point

Snapshot of the portfolio taken on 2026-10-03, before the UI/UX refinement work.
It is the React + TypeScript port of the prototype, with real project images, corrected
PriceOye / SheenPay / Echo content, and the accessibility fixes. Build and lint passed.

Saved in `.starting-point/`: `src/`, `public/`, `index.html`, `package.json`,
`package-lock.json`, `vite.config.ts`, `tsconfig*.json`, `.oxlintrc.json`.

## Restore

Tell Claude "starting point" and it will restore these files. By hand:

```sh
rm -rf src public
cp -R .starting-point/src .starting-point/public .
cp .starting-point/{index.html,package.json,package-lock.json,vite.config.ts,tsconfig.json,tsconfig.app.json,tsconfig.node.json,.oxlintrc.json} .
npm install && npm run build
```

`.old-portfolio-backup/` is the earlier portfolio, from before the prototype. Leave it alone.
