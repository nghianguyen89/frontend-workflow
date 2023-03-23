/* ===========================================================================
 * Task         : watch
 * Description  : Watching files (pug, scss, js, images)
 * Note         : Using Gulp v4
 * Package      : npm install --save-dev gulp
 * ===========================================================================*/

const configs = require('./configs');

const { watch } = require('gulp');

const { build_html } = require('./html');
const { build_css } = require('./css');
const { build_js } = require('./js');
const { sync_assets } = require('./assets-sync');

exports.wf = async function watch_files() {
    watch(configs.html.watch, build_html);
    watch(configs.css.watch, build_css);
    watch(configs.js.watch, build_js);
    watch(configs.sync_assets.watch, sync_assets);
};
