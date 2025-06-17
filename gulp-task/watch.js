/* ===========================================================================
 * Task         : watch
 * Description  : Watching files (pug, scss, js, images)
 * Note         : Using Gulp v5
 * Package      : npm install --save-dev gulp
 * ===========================================================================*/

/* Common */
const configs = require('./_configs_');

/* Packages */
const { watch } = require('gulp');

/* Task configs */
const dir_src = configs.source_dir;
const dir_public = configs.dist_dir;
const dir_assets = '/' + configs.assets_dir + '/';

const assets_src = dir_src + dir_assets;
const { build_html } = require('./html');
const { build_css } = require('./css');
const { build_js } = require('./js');
const assets = require('./assets');

exports.wf = function watch_files() {
    // Watch Pug files
    watch([dir_src + '/views/**/*.pug'], build_html);

    // Watch SCSS files
    watch([dir_src + '/styles/**/*.scss'], build_css);

    // Watch JS files
    watch([dir_src + '/scripts/**/*.js'], build_js);

    // Watch FontAwesome webfonts
    if (typeof assets.sync_fontawesome === 'function') {
        watch([dir_src + '/styles/fontawesome/webfonts/**/*.*'], assets.sync_fontawesome);
    }

    // Watch fonts
    if (typeof assets.sync_fonts === 'function') {
        watch([assets_src + 'fonts/**/*.*'], assets.sync_fonts);
    }

    // Watch images
    if (typeof assets.sync_images === 'function') {
        watch([assets_src + 'images/**/*.*'], assets.sync_images);
    }

    // Watch jQuery plugins
    if (typeof assets.sync_plugins === 'function') {
        watch([
            assets_src + 'plugins/jquery/jquery.min.js',
            assets_src + 'plugins/jquery/jquery-migrate.min.js',
        ], assets.sync_plugins);
    }
};