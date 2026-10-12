/* ===========================================================================
 * Task         : build_vite
 * Description  : Build application CSS/JS with Vite.
 * ===========================================================================*/

'use strict';

const path = require('path');
const log = require('fancy-log');
const configs = require('./_configs_');

let viteWatcher;

async function runViteBuild(watch = false) {
    const { build } = await import('vite');
    const options = {
        configFile: path.resolve('vite.config.mjs'),
        mode: configs.production ? 'production' : 'development',
    };

    if (watch) options.build = { watch: {} };

    return build(options);
}

exports.build_vite = async function build_vite() {
    log('Start building CSS/JS with Vite...');
    await runViteBuild();
    log('Vite CSS/JS build done.');
};

exports.watch_vite = async function watch_vite() {
    if (viteWatcher) return viteWatcher;

    // Stay in the Gulp process so --plugins/--project/--cms match the initial build.
    log('Start Vite incremental watcher...');
    viteWatcher = await runViteBuild(true);
    return viteWatcher;
};
