import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, preprocessCSS } from 'vite';

const require = createRequire(import.meta.url);
const configs = require('./gulp-task/_configs_.js');
const rootDir = process.cwd();
const virtualEntryId = 'virtual:legacy-bundle';
const resolvedVirtualEntryId = '\0' + virtualEntryId;
const virtualPluginPreludeId = 'virtual:plugin-prelude';
const resolvedVirtualPluginPreludeId = '\0' + virtualPluginPreludeId;
const viteHashUpdateMarker = '/*$vite$:1*/';

function toPosix(filePath) {
    return filePath.replace(/\\/g, '/');
}

function walkFiles(dir, filter) {
    if (!fs.existsSync(dir)) return [];

    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const item = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            files.push(...walkFiles(item, filter));
            continue;
        }

        if (!filter || filter(item)) {
            files.push(item);
        }
    }

    return files.sort((a, b) => toPosix(a).localeCompare(toPosix(b)));
}

function isPrivateScript(filePath) {
    return path.basename(filePath).startsWith('_');
}

function resolveAppScriptFiles() {
    const srcDir = path.resolve(rootDir, configs.source_dir);
    const detectDir = path.join(srcDir, 'scripts', 'detect');
    const functionsDir = path.join(srcDir, 'scripts', 'functions');
    const pagesDir = path.join(srcDir, 'scripts', 'pages');

    return [
        path.join(srcDir, 'scripts', 'configs.js'),
        ...walkFiles(detectDir, (file) => file.endsWith('.js') && !isPrivateScript(file)),
        ...walkFiles(functionsDir, (file) => file.endsWith('.js') && !isPrivateScript(file)),
        path.join(srcDir, 'scripts', 'template.js'),
        ...walkFiles(pagesDir, (file) => file.endsWith('.js') && !isPrivateScript(file)),
    ].filter((file) => fs.existsSync(file));
}

function getActivePluginScriptEntries(phase = 'main') {
    const registry = configs.plugins?.registry || {};
    const active = configs.plugins?.active || [];

    return active.flatMap((name) => {
        const plugin = registry[name];

        if (!plugin?.scripts) return [];

        return plugin.scripts
            .filter((entry) => (entry.phase || 'main') === phase)
            .map((entry) => ({ ...entry, plugin: name }));
    });
}

function renderExposeStatements(entry) {
    if (entry.exposeNamespace) {
        return `Object.assign(window, ${entry.importName});`;
    }

    return (entry.expose || [])
        .map((name) => `window.${name} = ${entry.importName};`)
        .join('\n');
}

function renderNpmScriptImport(entry, index, phase) {
    if (entry.type === 'npm') {
        return `import "${entry.path}";`;
    }

    if (entry.type !== 'npm-global') return '';

    const importName = entry.importName || `plugin${phase}${index}`;
    const statement = entry.namespaceImport || entry.exposeNamespace
        ? `import * as ${importName} from "${entry.path}";`
        : `import ${importName} from "${entry.path}";`;

    return [
        statement,
        renderExposeStatements({ ...entry, importName }),
        entry.after || '',
    ].filter(Boolean).join('\n');
}

function resolveLegacyPluginFile(entry) {
    return path.resolve(rootDir, configs.source_dir, 'assets', 'plugins', entry.path);
}

function renderLegacyScript(entry) {
    const file = resolveLegacyPluginFile(entry);
    const relative = toPosix(path.relative(rootDir, file));

    if (!fs.existsSync(file)) {
        throw new Error(`Plugin JS not found for "${entry.plugin}": ${file}`);
    }

    const content = fs
        .readFileSync(file, 'utf8')
        .replace(/\brequire\s*\(/g, '__legacyRequire__(');

    return `\n/* ${relative} */\n${content}\n`;
}

function renderAppScript(file) {
    const relative = toPosix(path.relative(rootDir, file));
    const content = fs
        .readFileSync(file, 'utf8')
        .replace(/\brequire\s*\(/g, '__legacyRequire__(');

    return `\n/* ${relative} */\n${content}\n`;
}

function legacyBundlePlugin() {
    const scriptListFile = path.resolve(rootDir, '.cache', 'vite-app-scripts.json');
    let scriptWatcher;
    let discoveryTimer;

    function updateScriptList() {
        const content = JSON.stringify(resolveAppScriptFiles().map(toPosix));
        if (fs.existsSync(scriptListFile) && fs.readFileSync(scriptListFile, 'utf8') === content) return;

        fs.mkdirSync(path.dirname(scriptListFile), { recursive: true });
        fs.writeFileSync(scriptListFile, content);
    }

    return {
        name: 'legacy-bundle-entry',
        buildStart() {
            if (!this.meta.watchMode || scriptWatcher) return;

            updateScriptList();
            // Directory registration alone does not discover new scripts.
            // Invalidate through a watched file-list only when discovery changes.
            scriptWatcher = fs.watch(
                path.resolve(rootDir, configs.source_dir, 'scripts'),
                { recursive: true },
                () => {
                    clearTimeout(discoveryTimer);
                    discoveryTimer = setTimeout(updateScriptList, 50);
                }
            );
            scriptWatcher.on('error', (error) => this.warn(error.message));
        },
        closeWatcher() {
            clearTimeout(discoveryTimer);
            scriptWatcher?.close();
            scriptWatcher = undefined;
        },
        resolveId(id) {
            if (id === virtualEntryId) return resolvedVirtualEntryId;
            if (id === virtualPluginPreludeId) return resolvedVirtualPluginPreludeId;
            return null;
        },
        load(id) {
            if (id === resolvedVirtualPluginPreludeId) {
                const preludeImports = getActivePluginScriptEntries('prelude')
                    .map((entry, index) => renderNpmScriptImport(entry, index, 'prelude'))
                    .join('\n');

                return `${preludeImports}\n`;
            }

            if (id !== resolvedVirtualEntryId) return null;

            const styleFile = toPosix(path.resolve(rootDir, configs.source_dir, 'styles', 'styles.scss'));
            const pluginEntries = getActivePluginScriptEntries();
            const npmImports = pluginEntries
                .filter((entry) => entry.type === 'npm' || entry.type === 'npm-global')
                .map((entry, index) => renderNpmScriptImport(entry, index, 'main'))
                .join('\n');
            const legacyPluginEntries = pluginEntries.filter((entry) => entry.type === 'legacy');
            const legacyPluginScripts = legacyPluginEntries
                .map(renderLegacyScript)
                .join(';\n');
            const appScriptFiles = resolveAppScriptFiles();
            const appScripts = appScriptFiles.map(renderAppScript).join(';\n');

            if (this.meta.watchMode) this.addWatchFile(scriptListFile);

            [
                ...legacyPluginEntries.map(resolveLegacyPluginFile),
                ...appScriptFiles,
            ].forEach((file) => this.addWatchFile(file));

            return `import "${virtualPluginPreludeId}";\nimport "${styleFile}";\n${npmImports}\nfunction __legacyRequire__() { return undefined; }\n${legacyPluginScripts}\n${appScripts}`;
        },
    };
}

function getGeneratedPosition(source, index) {
    const prefix = source.slice(0, index);
    const line = (prefix.match(/\n/g) || []).length;
    const lastLineBreak = prefix.lastIndexOf('\n');

    return {
        line,
        column: index - lastLineBreak - 1,
    };
}

function normalizeSourceMap(sourceMap, cssFileName) {
    const mapDirectory = path.resolve(rootDir, configs.dist_dir, path.dirname(cssFileName));
    const sourcesContent = (sourceMap.sources || []).map((source, index) => {
        const existingContent = sourceMap.sourcesContent?.[index];

        if (existingContent !== null && existingContent !== undefined) {
            return existingContent;
        }

        if (!path.isAbsolute(source) || !fs.existsSync(source)) return null;

        return fs.readFileSync(source, 'utf8');
    });

    return {
        ...sourceMap,
        file: path.basename(cssFileName),
        sources: (sourceMap.sources || []).map((source) => {
            if (!path.isAbsolute(source)) return source;

            return toPosix(path.relative(mapDirectory, source));
        }),
        sourcesContent,
    };
}

function cssSourceMapPlugin(isProduction) {
    let resolvedConfig;

    return {
        name: 'legacy-css-source-map',
        apply: 'build',
        enforce: 'post',
        configResolved(config) {
            resolvedConfig = config;
        },
        async generateBundle(_, bundle) {
            if (isProduction || !resolvedConfig.build.sourcemap) return;

            const cssFileName = `${configs.static.css}/${configs.files.css.app}`;
            const cssAsset = bundle[cssFileName];

            if (!cssAsset || cssAsset.type !== 'asset') {
                this.error(`CSS asset not found for source map: ${cssFileName}`);
            }

            const styleFile = path.resolve(
                rootDir,
                configs.source_dir,
                'styles',
                'styles.scss'
            );
            const result = await preprocessCSS(
                fs.readFileSync(styleFile, 'utf8'),
                styleFile,
                resolvedConfig
            );

            if (!result.map) {
                this.error(`Vite did not return a CSS source map for ${styleFile}`);
            }

            const rawSourceMap = typeof result.map === 'string'
                ? JSON.parse(result.map)
                : result.map;
            const preprocessed = { code: result.code, sourceMap: rawSourceMap };
            const bundledCss = String(cssAsset.source).replace(viteHashUpdateMarker, '');
            const generatedIndex = bundledCss.indexOf(preprocessed.code);

            if (generatedIndex < 0) {
                this.error(`Generated CSS does not match the Vite preprocessor output: ${cssFileName}`);
            }

            const normalizedMap = normalizeSourceMap(preprocessed.sourceMap, cssFileName);
            const cssMap = generatedIndex === 0
                ? normalizedMap
                : {
                    version: 3,
                    file: path.basename(cssFileName),
                    sections: [{
                        offset: getGeneratedPosition(bundledCss, generatedIndex),
                        map: normalizedMap,
                    }],
                };
            const mapFileName = `${cssFileName}.map`;

            cssAsset.source = `${bundledCss}\n/*# sourceMappingURL=${path.basename(mapFileName)} */\n`;
            this.emitFile({
                type: 'asset',
                fileName: mapFileName,
                source: JSON.stringify(cssMap),
            });
        },
    };
}

export default defineConfig(({ mode }) => {
    const isProduction = mode === 'production';

    return {
        root: rootDir,
        publicDir: false,
        plugins: [legacyBundlePlugin(), cssSourceMapPlugin(isProduction)],
        css: {
            devSourcemap: !isProduction,
            preprocessorOptions: {
                scss: {
                    quietDeps: true,
                    loadPaths: [path.resolve(rootDir, configs.source_dir, 'styles')],
                },
            },
        },
        build: {
            outDir: configs.dist_dir,
            emptyOutDir: false,
            sourcemap: true,
            minify: isProduction ? 'esbuild' : false,
            cssMinify: isProduction,
            reportCompressedSize: isProduction,
            cssCodeSplit: false,
            target: 'es2015',
            rolldownOptions: {
                input: {
                    bundle: virtualEntryId,
                },
                output: {
                    format: 'iife',
                    codeSplitting: false,
                    entryFileNames: `${configs.static.js}/${configs.files.js.app}`,
                    chunkFileNames: `${configs.static.js}/[name].min.js`,
                    assetFileNames(assetInfo) {
                        if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                            return `${configs.static.css}/${configs.files.css.app}`;
                        }

                        return `${configs.assets_dir}/[name][extname]`;
                    },
                },
            },
        },
    };
});
