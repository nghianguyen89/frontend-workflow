# Gulp/Vite Project Troubleshooting Knowledge Base

## Purpose

This document is reusable technical memory for projects that share this Gulp/Vite frontend workflow. It contains only verified build, watch, preview, and artifact-delivery lessons that can be applied across equivalent frontend repositories.

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
- **Development and production have different performance requirements.** Minification, source maps, and compressed-size reporting should be enabled deliberately instead of being inherited blindly by every watch rebuild.
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

Gulp invokes fresh `vite.build()` operations after every change instead of keeping incremental Vite build watchers alive. Saves made while a full build is running can leave another Gulp execution queued. Development rebuilds may also perform production-only work such as minification, source-map generation, or compressed-size calculation.

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

Inside the plugin hook that reads the files, register every dependent file with `this.addWatchFile()`. Register a containing directory when additions or removals must also cause the virtual entry to be regenerated.

**Relevant areas**

- `vite.config.mjs`
- Virtual module `load()` hooks
- Source discovery helpers used by virtual entries

**Prevention / Notes**

Whenever a Vite plugin reads a file manually, treat watch registration as part of the same implementation. Verify changes, additions, and removals separately when source discovery is directory-based.

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

## Troubleshooting-Driven Technical Decisions

### Development uses persistent incremental watchers

**Reason:** Recreating the complete Vite build graph after every save repeats dependency transformation and allows save events to queue behind long-running builds.

**Decision:** Start persistent Vite build watchers with the development task and let the bundler determine affected entries.

**Implication:** Gulp should not also watch the same JS/SCSS sources and start another build.

### Production-only optimization stays conditional

**Reason:** Minification, source maps, and compressed-size reporting add work that is not always useful during local iteration.

**Decision:** Enable expensive output optimization according to the explicit production flag.

**Implication:** Development files may retain production-style filenames while containing readable, unminified output. Do not use filename suffixes alone to infer optimization state.

### Virtual modules declare their filesystem dependencies

**Reason:** Source content loaded manually with filesystem APIs is invisible to ordinary import-graph discovery.

**Decision:** Register each manually read source, or its containing directory when required, with `this.addWatchFile()`.

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
7. Confirm development flags do not unintentionally enable production minification, source maps, or compressed-size reporting.
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
