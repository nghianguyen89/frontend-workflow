/* ===========================================================================
 * Task         : watch
 * Description  : Watching files (pug, scss, js, images)
 * Note         : Using Gulp v4
 * Package      : npm install --save-dev gulp
 * ===========================================================================*/

/* Common */
const configs = require('./_configs_');

/* Packages */
const { series, watch } = require('gulp');
const browserSync = require('./browser-sync');


/* Task configs */
const dir_src = configs.source_dir;
const dir_public = configs.dist_dir;
const assets_src = dir_src + '/assets/';
const { build_html } = require('./html');
const { build_css } = require('./css');
const { build_js } = require('./js');
const assets = require('./assets');


/* Task */
exports.wf = async function watch_files() {

    //░░░░░ pugjs
    watch(
        [
            dir_src + '/views/**/*.pug'
        ],
        build_html
    );

    //░░░░░ css
    watch(
        [
            dir_src + '/styles/**/*.scss',
            '!' + dir_src + '/styles/_plugins.scss'
        ],
        build_css
    );

    //░░░░░ javascript
    watch(
        [
            dir_src + '/scripts/**/*.js'
        ],
        build_js
    );

    //░░░░░ sync assets
    watch(
        [
            assets_src + 'fonts/**/*.*',
        ],
        assets.sync_fonts
    );

    watch(
        [
            assets_src + 'images/**/*.*',
        ],
        assets.sync_images
    );

    watch(
        [
            assets_src + 'plugins/jquery/jquery.min.js',
            assets_src + 'plugins/jquery/jquery-migrate.min.js',
        ],
        assets.sync_plugins
    );

};
