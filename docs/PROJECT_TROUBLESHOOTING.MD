# Gulp/Vite Project Troubleshooting Knowledge Base

## Purpose

This document is reusable technical memory for projects that share this Gulp/Vite frontend workflow. It contains verified build, watch, preview, artifact-delivery and frontend-library lessons that can be applied across equivalent repositories.

Before applying an entry in another repository, confirm that its current task graph, paths, and package versions still match the described behavior.

## Quick Project Gotchas

- Run pnpm and Gulp commands from the repository root that contains `package.json`.
- A successful build proves that artifacts were generated, not that the browser loaded the expected artifact or rendered the expected behavior.
- Copy/sync tasks can only deliver files that already exist; they do not implicitly build missing artifacts.
- Avoid assigning the same source files to both Gulp and Vite watchers. One change should have one build owner.
- Development watch should use persistent incremental builders. Repeatedly calling a fresh production-style build after every save is unnecessarily expensive.
- Files read manually into a Vite virtual module are outside the normal import graph unless the plugin registers them as watch files.

## Recurring Problems / Project Gotchas

- **Generated output is often mistaken for the source of a bug.** Inspect the expected file under `dist/` before changing a destination path or copy mapping.
- **Watch latency can be queued work rather than a slow current build.** Gulp queues another execution when a file changes while the previous task is still running.
- **Development and production have different performance requirements.** Keep minification and compressed-size reporting conditional on production; retain development source maps for debugging.
- **Browser reload timing matters.** Reload only after the task responsible for an output has completed writing it.

## Troubleshooting History

### Copy or sync task cannot deliver an artifact that was never built

**Symptoms**

- A CSS, JavaScript, image, or font file is missing from its final destination.
- Changing the destination mapping appears necessary because the expected file is absent.

**Root cause**

The copy/sync task only transfers existing build output. The source artifact was missing, stale, or resolved from the wrong working directory.

**Resolution**

Run the required build before the sync task. Inspect the source artifact under `dist/`, then verify the resolved source path and destination mapping in that order.

**Relevant areas**

- `package.json`
- `gulpfile.js`
- `gulp-task/assets.js`
- `gulp-task/_configs_.js`
- `dist/`

**Prevention / Notes**

Keep build and sync responsibilities explicit. Use a combined build-and-sync command for normal delivery, and expose sync-only commands only for cases where the required artifacts are already present.

### Pug preview reloads stale HTML

**Symptoms**

- Saving a `.pug` file reloads BrowserSync, but the browser shows the previous HTML until another manual refresh.

**Root cause**

BrowserSync watches generated HTML and reloads while Gulp is still writing the file, before the complete Pug build finishes.

**Resolution**

Call `browserSync.reload()` from the completed Pug pipeline callback. Do not also watch generated HTML for automatic reloads.

**Relevant areas**

- `gulp-task/html.js`
- `gulp-task/browser-sync.js`
- `gulp-task/watch.js`

**Prevention / Notes**

Keep one HTML reload path. BrowserSync may watch completed CSS, JavaScript, and image outputs, but Pug reload must be tied to successful task completion.

### Development JS and SCSS rebuilds become slow during a long watch session

**Symptoms**

- Local JS or SCSS edits take increasingly long to appear.
- Restarting the development command temporarily feels faster.
- Editing one source file rebuilds unrelated bundle entries.

**Root cause**

Gulp invokes fresh `vite.build()` operations after every change instead of keeping incremental Vite build watchers alive. Saves made while a full build is running can leave another Gulp execution queued. Development rebuilds may also perform production-only work such as minification or compressed-size calculation. Source maps remain useful in development and should stay enabled.

**Resolution**

Use persistent Vite build watchers for the relevant entries and let Vite rebuild only entries affected by the changed module. Remove overlapping Gulp JS/SCSS watchers. Disable production-only output optimization in development while retaining it for production builds.

**Relevant areas**

- `gulp-task/vite.js`
- `gulp-task/watch.js`
- `gulpfile.js`
- `vite.config.mjs`

**Prevention / Notes**

Do not call a complete multi-entry Vite build from a generic Gulp file-change handler. Measure initial build and incremental rebuild separately. When an editor performs multiple writes per save, rely on one incremental watcher rather than stacking independent rebuild queues.

### Vite watch misses files embedded in a virtual module

**Symptoms**

- Initial output contains concatenated or generated source code, but editing one of its source files does not trigger a rebuild.
- Restarting the watcher picks up the change.

**Root cause**

The Vite plugin reads source files with `fs.readFileSync()` and returns their contents from a virtual module. Because those files are not imported normally, they are not automatically part of the module graph watched by Vite.

**Resolution**

Inside the plugin hook that reads the files, register every dependent file with `this.addWatchFile()`. For additions/removals, maintain a development-only script-list file under `.cache/` and register it from the virtual entry load hook. A recursive native directory watcher updates this list only when the discovered file set changes; Vite remains the sole build owner. Close that discovery watcher in `closeWatcher()`.

**Relevant areas**

- `vite.config.mjs`
- Virtual module `load()` hooks
- Source discovery helpers used by virtual entries

**Prevention / Notes**

Whenever a Vite plugin reads a file manually, treat watch registration as part of the same implementation. Verified on Windows with Vite 8.2.2/Rolldown 1.2.7: registering a directory alone did not trigger a rebuild for a new script. Test edits, additions, nested additions and removals separately with `pnpm test:workflow`.

### pnpm or Gulp failure is caused by command context

**Symptoms**

- `ERR_PNPM_NO_PKG_MANIFEST` when starting or building.
- `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` when invoking Gulp through pnpm in a non-interactive session.

**Root cause**

The first error occurs when the command is run outside the repository root. The second can occur when pnpm attempts a module-directory operation without an interactive terminal; it does not prove that the Gulp task itself is broken.

**Resolution**

Run commands from the repository root. After dependencies are installed, use the project-local Gulp executable for non-interactive task execution when invoking Gulp through pnpm triggers the non-TTY package-management path.

**Relevant areas**

- `package.json`
- `pnpm-workspace.yaml`
- `node_modules/.bin/gulp.cmd`

**Prevention / Notes**

Confirm the current working directory and package manifest before changing task configuration. Diagnose package-manager invocation failures separately from build-pipeline failures.

### Heightline locks in incorrect heights when images or fonts load late

**Problem:** Equal-height items overflow or retain stale heights on slow connections, after content changes, or when hidden containers become visible.

**Root cause:** `src/scripts/detect/heightline.js` measured after a fixed delay and subsequently refreshed primarily on window resize. `_heightline` initialized another plugin instance on each `inview` event, accumulating listeners. Its row path also removed generated group classes before the table-cell lookup. The old height calculation omitted borders and truncated fractional padding.

**Fix:** Replace the old implementation with a single jQuery plugin in `src/scripts/detect/smart_height.js`: `$(items).smart_height(options | 'refresh' | 'destroy')`. Container mode, `$(containers).smart_height({ itemSelector: '.card' })`, discovers later children and keeps each container's group independent. Coalesce measurements with `requestAnimationFrame`; refresh on captured resource load/error, font readiness/completion, DOM mutations and observed element/descendant size changes. Clear managed heights before measuring and handle both box-sizing modes. Restore original inline styles on destroy or inactive breakpoints; replace repeated instances. The old `heightLine()`/`_heightline()` APIs are removed.

**Prevention:** A delay cannot guarantee resource readiness, and window load does not cover later lazy images or inserted content. Ignore observer notifications caused by the equalizer's own writes. Use disjoint selectors for independent instances. `itemPerRow` groups visible items in DOM order, not by geometric row position. Prefer CSS grid/flex stretch when the layout permits it. Run `node tests/smart-height.browser.cjs` with Node 22+ and Edge (or set `HEIGHTLINE_BROWSER` and `HEIGHTLINE_TEST_FONT` to a Chromium executable and a TTF fixture).

### Development CSS has no SCSS source map

**Problem:** Dev IIFE builds have no `styles.min.css.map`, even when JavaScript maps exist.

**Root cause:** `build.sourcemap` was production-only. Enabling it fixes JS maps, but Vite 8.2.2 does not emit maps for this workflow's extracted CSS with `cssCodeSplit: false`.

**Fix:** Keep `build.sourcemap: true`. The development-only `legacy-css-source-map` plugin uses Vite's own `preprocessCSS()` map, verifies the preprocessed CSS matches the output, normalizes sources relative to the map, and attaches the map to `styles.min.css`.

**Prevention:** Verify CSS and JS maps separately. Keep the plugin aligned with configured output names and revalidate it when upgrading Vite; do not silently emit a map for CSS that does not match.

### An SCSS edit triggers a full BrowserSync reload

**Problem:** SCSS builds successfully but the page reloads, losing local page state.

**Root cause:** Vite watch rewrites JS even when its contents are unchanged. A broad `dist/**` watcher also treats source-map writes as reload-worthy changes.

**Fix:** Watch CSS through BrowserSync's native injection path. Snapshot JS hashes before watching, wait for writes to settle, and reload only for changed JS contents or actual JS additions/removals. Leave HTML reload to the completed Pug task; do not watch map files for reloads.

**Prevention:** Test CSS-only and JS edits separately. Do not restore a broad generated-output reload glob or unconditional JS reload.

### Standalone CSS and watch commands diverge from the normal dev pipeline

**Problem:** `gulp watch` misses JS/SCSS changes, or `gulp css` replaces Vite-generated CSS with output from another compiler path.

**Root cause:** The watch task starts only Gulp's Pug/static watchers. A spawned Vite CLI does not inherit Gulp CLI flags such as `--plugins`. A separate Sass/PostCSS task can overwrite the app CSS independently of Vite's configuration and dependency graph.

**Fix:** Include `watch_vite` in both `watch` and `dev`; start the persistent watcher with Vite's API in the same process to preserve configuration. Route `build_css` through `build_vite`; explicit CSS builds also rebuild JS.

**Prevention:** Give application CSS/JS one build owner and check standalone commands as well as `pnpm start`.

### Fragment-only links navigate to the root on nested pages

**Problem:** A `scrollTo` link with `href="#section"` on a nested route goes to `/#section`.

**Root cause:** Resolving the link with `window.location.origin` assigns the root path, making the same-page check fail.

**Fix:** Resolve it with `new URL(href, window.location.href)` before comparing paths.

**Prevention:** Test fragment-only and relative links on nested routes.

### Fancyapps Carousel Autoscroll speed is ignored

**Problem:** Carousels with different top-level `speed` values move at the same speed.

**Root cause:** In Fancyapps UI 6, speed belongs to the `Autoscroll` plugin, which reads `options.Autoscroll` and otherwise defaults to `3`.

**Fix:** Register `{ Autoscroll }` and pass `Autoscroll: { speed: value }` as the Carousel option. The template registry already exposes `window.Autoscroll`.

**Prevention:** Keep plugin options under the matching case-sensitive plugin key. Higher Autoscroll speed values move faster; there is no site-specific carousel implementation to copy into this template.

### DataTables configuration and installed dependencies drift apart

**Problem:** Default builds fail to find FixedColumns CSS, or frozen installs reject the manifest.

**Root cause:** The manifest declares DataTables 3.0.4 and FixedColumns 6.0.0, but the lockfile still has DataTables 3.0.3 and no FixedColumns. A duplicate registry key also hides the original `depends: ['jquery']`.

**Fix:** Keep one DataTables registry entry with its jQuery dependency and synchronize the lockfile with the declared package versions; reinstall with the frozen lockfile.

**Prevention:** Commit manifest, plugin registry and lockfile changes together. Verify a frozen install and default build before assuming a missing plugin file is a Vite bug.

### CMS font mirroring deletes destination-only assets

**Problem:** A production validation build removes tracked font files present only in the CMS destination.

**Root cause:** The WordPress target has `sync.fonts: true`. `gulp-file-sync` mirrors `dist` fonts and deletes destination files absent from that source; CSS/JS copying and font mirroring have different semantics.

**Fix:** Restore unintended validation deletions from the previously clean tracked files. Use font mirroring only with a complete source set; configure `sync.fonts: false` when CMS fonts must remain independent.

**Prevention:** Inspect target sync flags before building. Validate build/sync in a source copy when the CMS destination contains independent assets, and review the worktree for asset deletions afterwards.

### Git push fails over SSH while another personal repository uses HTTPS

**Problem:** One GitHub repository cannot push and reports `Host key verification failed`, while another repository using the same personal account pushes successfully.

**Root cause:** The failing remote uses SSH; the working remote uses HTTPS with Git Credential Manager. SSH host verification fails before repository authentication. Git `user.name`/`user.email` identify commit authors and do not select the authentication mechanism.

**Fix:** Verify the same repository over HTTPS, including `git push --dry-run`, then use `git remote set-url origin https://github.com/OWNER/REPO.git` to match the working transport. If a separate push URL exists, update it too.

**Prevention:** Compare both fetch/push URLs and credential transports before changing account permissions. Verify push access with dry-run; do not bypass SSH host verification to hide a transport configuration problem.

## Troubleshooting-Driven Technical Decisions

### Development uses persistent incremental watchers

**Reason:** Recreating the complete Vite build graph after every save repeats dependency transformation and allows save events to queue behind long-running builds.

**Decision:** Start persistent Vite build watchers with the development task and let the bundler determine affected entries.

**Implication:** Gulp should not also watch the same JS/SCSS sources and start another build.

### Production-only optimization stays conditional

**Reason:** Minification and compressed-size reporting add work that is not useful during local iteration. Source maps help debugging and stay enabled in development.

**Decision:** Enable expensive output optimization according to the explicit production flag.

**Implication:** Development files may retain production-style filenames while containing readable, unminified output. Do not use filename suffixes alone to infer optimization state.

### Virtual modules declare their filesystem dependencies

**Reason:** Source content loaded manually with filesystem APIs is invisible to ordinary import-graph discovery.

**Decision:** Register each manually read source with `this.addWatchFile()`. For discovered script sets, also register the file-list used to invalidate the virtual entry on additions/removals; directory registration alone is insufficient in this workflow.

**Implication:** A virtual module is not watch-safe until edits and file-list changes have been tested without restarting the process.

### Artifact delivery follows artifact generation

**Reason:** A copy step cannot repair or replace a missing upstream build result.

**Decision:** Investigate generation, resolved source path, and destination mapping in that order.

**Implication:** Build first; use sync-only workflows only when the expected artifacts already exist.

## Investigation Checklist

1. Confirm the current directory, `package.json`, package manager, Node version, and active development command.
2. Identify which task owns the changed source: Gulp, Vite, or another watcher.
3. Check whether one save triggers multiple tasks or multiple bundle entries.
4. Compare initial build time with incremental rebuild time.
5. Inspect Gulp queueing and task completion behavior before assuming a memory leak.
6. For virtual modules, list every filesystem read and confirm matching `addWatchFile()` registrations.
7. Confirm development retains source maps without enabling production minification or compressed-size reporting.
8. Inspect generated artifacts under `dist/` before debugging copy or destination mappings.
9. Tie BrowserSync reloads to completed writes and avoid duplicate reload paths.
10. Run both development and production builds after changing shared build configuration.

## Validation Checklist for Watcher Changes

1. Start the normal development command from a clean state.
2. Edit a page-only JavaScript file and confirm that only the affected bundle rebuilds.
3. Edit shared SCSS and confirm that every dependent CSS entry rebuilds.
4. Edit a manually embedded virtual-module source and confirm that no restart is required.
5. Add or remove a discovered source file when directory discovery is supported.
6. Save repeatedly during a rebuild and confirm latency does not accumulate through duplicate watchers.
7. Confirm BrowserSync reloads or injects the completed output once.
8. Run the production build and verify minification, source maps, output names, and copy/sync behavior.

## Maintenance Rules

- Before substantial debugging, search this document for the symptom or affected area and verify that the guidance still matches the current repository.
- Record only verified, resolved findings that are reusable across projects sharing this workflow.
- Update an existing entry when the underlying cause already exists instead of adding a duplicate incident.
- Keep entries concise: problem, root cause, fix, and prevention.
- Do not copy transcripts, large logs, temporary timing noise, credentials, tokens, personal information, or confidential runtime values.
- Current verified behavior takes precedence over older guidance when the build architecture or dependency versions change.
