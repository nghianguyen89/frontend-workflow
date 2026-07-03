import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

const require = createRequire(import.meta.url);
const configs = require('./gulp-task/_configs_.js');
const rootDir = process.cwd();
const virtualEntryId = 'virtual:legacy-bundle';
const resolvedVirtualEntryId = '\0' + virtualEntryId;
const virtualPluginPreludeId = 'virtual:plugin-prelude';
const resolvedVirtualPluginPreludeId = '\0' + virtualPluginPreludeId;

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
    return {
        name: 'legacy-bundle-entry',
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
            const legacyPluginScripts = pluginEntries
                .filter((entry) => entry.type === 'legacy')
                .map(renderLegacyScript)
                .join(';\n');
            const appScripts = resolveAppScriptFiles().map(renderAppScript).join(';\n');

            return `import "${virtualPluginPreludeId}";\nimport "${styleFile}";\n${npmImports}\nfunction __legacyRequire__() { return undefined; }\n${legacyPluginScripts}\n${appScripts}`;
        },
    };
}

export default defineConfig(() => ({
    root: rootDir,
    publicDir: false,
    plugins: [legacyBundlePlugin()],
    css: {
        devSourcemap: true,
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
        minify: 'esbuild',
        cssMinify: true,
        cssCodeSplit: false,
        target: 'es2015',
        rolldownOptions: {
            input: {
                bundle: virtualEntryId,
            },
            output: {
                format: 'iife',
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
}));
