/* ===========================================================================
 * Task         : build_vite
 * Description  : Build application CSS/JS with Vite.
 * ===========================================================================*/

'use strict';

const path = require('path');
const { spawn } = require('node:child_process');
const log = require('fancy-log');
const configs = require('./_configs_');

exports.build_vite = async function build_vite() {
    log('░░░░░░░░░░⌛ Start building CSS/JS with Vite... ░░░░░░░░░░');

    const { build } = await import('vite');

    await build({
        configFile: path.resolve('vite.config.mjs'),
        mode: configs.production ? 'production' : 'development',
    });

    log('░░░░░░░░░░ ✔ Vite CSS/JS build done ░░░░░░░░░░');
};

exports.watch_vite = function watch_vite() {
    const viteCli = path.resolve('node_modules', 'vite', 'bin', 'vite.js');

    log('░░░░░░░░░░⌛ Start Vite incremental watcher... ░░░░░░░░░░');

    return spawn(process.execPath, [viteCli, 'build', '--watch', '--mode', 'development'], {
        stdio: 'inherit',
    });
};
