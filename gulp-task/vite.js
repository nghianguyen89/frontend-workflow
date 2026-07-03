/* ===========================================================================
 * Task         : build_vite
 * Description  : Build application CSS/JS with Vite.
 * ===========================================================================*/

'use strict';

const path = require('path');
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
