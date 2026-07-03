# Codex Project Notes

Last updated: 2026-07-03

This file records the working context for this repository so another Codex session can quickly continue from the same state.

## Project Shape

- Frontend workflow for static HTML/CSS/JS with Gulp + Vite.
- Source lives in `src/`.
- Static build output lives in `dist/`.
- CMS source sync target currently points to WordPress under `src/_cms_/wp_themes/`.
- Main task config is `gulp-task/_configs_.js`.
- Vite build config is `vite.config.mjs`.

## Recent Work Completed

The build pipeline was upgraded so vendor plugins are no longer blindly loaded from `src/assets/plugins/**/*.css/js`.

Current behavior:

- Plugins that have usable npm packages were moved to `package.json` dependencies.
- Legacy plugin source folders were removed for npm-backed plugins.
- Only these legacy plugin folders remain in `src/assets/plugins/`:
  - `floating-totop-button`
  - `jquery-zip2`
- `jquery.min.js` and `jquery-migrate.min.js` are no longer copied/loaded as separate static scripts.
- Vendor/plugin JS is bundled by Vite into `dist/assets/js/bundle.min.js`.
- Plugin CSS is concatenated/minified by Gulp into `dist/assets/css/plugins.min.css`.
- App SCSS/JS is built by Vite into:
  - `dist/assets/css/styles.min.css`
  - `dist/assets/js/bundle.min.js`

## Plugin Configuration

Plugin configuration is centralized in `gulp-task/_configs_.js`.

Important sections:

- `plugin_registry`: declares each plugin, its npm/legacy CSS, JS, optional dependencies, and optional extra assets.
- `plugins.active`: resolved list of active plugins.
- `resolvePluginList()`: automatically inserts plugin dependencies, for example jQuery before jQuery plugins.

Default behavior currently enables every plugin in `plugin_registry` to preserve the old project behavior.

For a new project, trim plugins by editing config or passing CLI/env:

```sh
gulp build --prod --plugins=jquery,bootstrap,swiper,fancyapps
```

or:

```sh
PLUGINS=jquery,bootstrap,swiper,fancyapps gulp build --prod
```

When disabling a plugin, check whether custom scripts still use its globals. Examples:

- `Fancybox`
- `Swiper`
- `Chart`
- `ChartDataLabels`
- `PerfectScrollbar`
- `wanakana`
- jQuery plugins under `jQuery.fn.*`

## npm-backed Plugins

These plugins were moved to npm dependencies:

- `@fancyapps/ui`
- `animate.css`
- `animejs`
- `bootstrap`
- `chart.js`
- `chartjs-plugin-datalabels`
- `datatables.net-dt`
- `hamburgers`
- `imagemapster`
- `jarallax`
- `jquery`
- `jquery-inview`
- `jquery-migrate`
- `jquery-ui-dist`
- `normalize.css`
- `odometer`
- `perfect-scrollbar`
- `swiper`
- `wanakana`
- `wowjs`

Versions were pinned close to the previous legacy assets where possible to avoid accidental API drift.

## CSS Plugin Assets

`jquery-ui-dist` CSS references icon files under `images/`.

The plugin registry includes:

```js
assets: [{ type: 'npm', from: 'jquery-ui-dist/images', to: 'images' }]
```

`gulp-task/plugins.js` copies those assets to:

```txt
dist/assets/css/images/
```

`gulp-task/assets.js` also syncs these plugin CSS assets to the CMS CSS folder:

```txt
src/_cms_/wp_themes/assets/css/images/
```

## Minify Behavior

CSS/JS compile now minifies even in dev task mode.

In `vite.config.mjs`:

```js
minify: 'esbuild',
cssMinify: true,
```

This means tasks like `gulp css --dev` and watcher-triggered Vite builds still output `.min.css` and `.min.js`.

## Static HTML Loading

`src/views/_templates/default.pug` now loads only:

```pug
link(rel="stylesheet", href=relativeRoot + 'assets/css/plugins' + file_minify + '.css')
link(rel="stylesheet", href=relativeRoot + 'assets/css/styles' + file_minify + '.css')
script(src=relativeRoot + 'assets/js/bundle' + file_minify + '.js')
```

Separate script tags for jQuery and jQuery Migrate were removed because those are bundled by Vite.

## Commands Used For Verification

After the refactor, these passed:

```sh
pnpm install
pnpm build
gulp css --dev
pnpm build
```

On this Windows/Codex local setup, sometimes commands need the bundled Node path in `PATH`, for example:

```powershell
$env:PATH='C:\Users\nghia\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\nghia\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin;' + $env:PATH
pnpm build
```

## Known Build Warnings

Current warnings are known and not build blockers:

- `imagemapster` npm package uses direct `eval`; Vite/Rolldown warns about this.
- Bundle is large when all plugins are active by default. This should improve when each project trims `plugins.active`.
- `../images/icon-tel4.png` is referenced by app CSS and left unresolved at build time; this warning existed during verification and does not stop the build.

## Important Files Touched

- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `.gitignore`
- `README.md`
- `vite.config.mjs`
- `gulp-task/_configs_.js`
- `gulp-task/plugins.js`
- `gulp-task/assets.js`
- `gulp-task/clean.js`
- `gulp-task/watch.js`
- `gulp-task/default.js`
- `src/views/_templates/default.pug`

## How To Continue

Good next steps:

- For each new project, decide the real plugin list and pass `--plugins=...` or edit `plugins.active`.
- Consider splitting vendor bundle only if bundle size becomes painful after trimming plugins.
- If replacing `imagemapster`, remove it from registry/package to eliminate the eval warning.
- If a plugin has CSS assets, add an `assets` entry to the registry so Gulp copies them next to `plugins.min.css`.
