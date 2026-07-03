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
const { build_vite } = require('./vite');
const { build_plugins } = require('./plugins');
const assets = require('./assets');
const { series } = require('gulp');

exports.wf = function watch_files() {
    // Watch Pug files
    watch([dir_src + '/views/**/*.pug'], build_html);

    // Watch SCSS files
    watch([dir_src + '/styles/**/*.scss'], series(build_vite, assets.sync_cms));

    // Watch JS files
    watch([
        dir_src + '/scripts/**/*.js',
        assets_src + 'plugins/**/*.js',
    ], series(build_vite, assets.sync_cms));

    // Watch plugin CSS files
    watch([assets_src + 'plugins/**/*.css'], series(build_plugins, assets.sync_cms));

    // Watch FontAwesome webfonts
    if (typeof assets.sync_fontawesome === 'function') {
        watch([dir_src + '/styles/fontawesome/webfonts/**/*.*'], assets.sync_fontawesome);
    }

    // Watch fonts
    if (typeof assets.sync_fonts === 'function') {
        watch([assets_src + 'fonts/**/*.*'], series(assets.sync_fonts, assets.sync_cms));
    }

    // Watch images
    if (typeof assets.sync_images === 'function') {
        watch([assets_src + 'images/**/*.*'], series(assets.sync_images, assets.sync_cms));
    }

};
