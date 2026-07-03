/* ===========================================================================
 * Task         : build_plugins
 * Description  : Compile SCSS files to CSS files.
 * ===========================================================================*/

/* Common */
const configs = require('./_configs_');

/* Packages */
const { src, dest } = require('gulp');
const $ = require('gulp-load-plugins')({});
const pump = require('pump');
const log = require('fancy-log');
const cssnano = require('cssnano');
const path = require('path');
const fs = require('fs');


/* Task configs */
const dir_public = configs.dist_dir;
const plugins_dest = `${dir_public}/${configs.static.css}/`;

function resolvePluginFile(entry) {
    if (entry.type === 'npm') {
        return path.resolve(configs.paths.root, 'node_modules', entry.path);
    }

    return path.resolve(configs.paths.root, configs.source_dir, 'assets', 'plugins', entry.path);
}

function getActivePluginStyles() {
    const registry = configs.plugins && configs.plugins.registry ? configs.plugins.registry : {};
    const active = configs.plugins && configs.plugins.active ? configs.plugins.active : [];

    return active.flatMap((name) => {
        const plugin = registry[name];

        if (!plugin || !plugin.styles) return [];

        return plugin.styles.map((entry) => {
            const file = resolvePluginFile(entry);

            if (!fs.existsSync(file)) {
                throw new Error(`Plugin CSS not found for "${name}": ${file}`);
            }

            return file;
        });
    });
}

function getActivePluginAssets() {
    const registry = configs.plugins && configs.plugins.registry ? configs.plugins.registry : {};
    const active = configs.plugins && configs.plugins.active ? configs.plugins.active : [];

    return active.flatMap((name) => {
        const plugin = registry[name];

        if (!plugin || !plugin.assets) return [];

        return plugin.assets.map((entry) => {
            const from = entry.type === 'npm'
                ? path.resolve(configs.paths.root, 'node_modules', entry.from)
                : path.resolve(configs.paths.root, configs.source_dir, 'assets', 'plugins', entry.from);
            const to = path.resolve(configs.paths.root, plugins_dest, entry.to);

            if (!fs.existsSync(from)) {
                throw new Error(`Plugin asset not found for "${name}": ${from}`);
            }

            return { from, to };
        });
    });
}

function copyPluginAssets() {
    getActivePluginAssets().forEach(({ from, to }) => {
        fs.cpSync(from, to, { recursive: true });
        log(`Plugin asset copied: ${path.relative(configs.paths.root, to)}`);
    });
}

/* Task */
exports.build_plugins = async function build_plugins() {
    log('░░░░░░░░░░⌛ Start concatenating the plugins CSS files... ░░░░░░░░░░');
    const plugins_src = getActivePluginStyles();

    if (plugins_src.length === 0) {
        log('No plugin CSS configured. Skipping plugins CSS build.');
        return;
    }

    await new Promise((resolve, reject) => {
        pump(
            src(plugins_src, { allowEmpty: true }),
            $.concat('plugins.min.css'),
            $.postcss([cssnano()]),
            dest(plugins_dest),
            (error) => {
                if (error) {
                    log(error);
                    reject(error);
                } else {
                    copyPluginAssets();
                    log('░░░░░░░░░░ ✓ The plugins CSS files are concatenated. ░░░░░░░░░░\n');
                    resolve();
                }
            }
        );
    });
};
