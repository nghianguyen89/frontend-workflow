/* ===========================================================================
 * Task         : copy_assets
 * Description  : Copy/Sync all file in folder source to build
 * Note         : Using Gulp v4
 * Package      : npm install --save-dev gulp gulp-load-plugins pump gulp-file-sync
 * ===========================================================================*/

/* Common */
const configs = require('./_configs_');

/* Packages */
const $ = require('gulp-load-plugins')({ rename: { 'gulp-file-sync': 'fileSync' } });
const log = require('fancy-log');


/* Task configs */
const dir_src = configs.source_dir;
const dir_public = configs.dist_dir;
const assets_src = dir_src + '/assets/';
const assets_html = dir_public + '/assets/';


/* Task */
module.exports = {

    sync_fonts: async function () {
        await $.fileSync(
            assets_src + 'fonts/',
            assets_html + 'fonts/',
        );
        log('Fonts is synced.');
    },

    sync_images: async function () {
        await $.fileSync(
            assets_src + 'images/',
            assets_html + 'images/',
        );
        log('Images is synced.');
    },

    sync_plugins: async function () {
        await $.fileSync(
            assets_src + 'plugins/jquery/',
            assets_html + 'js/', {
            ignore: [
                'bundle.js',
                'bundle.js.map',
                'bundle.min.js',
                'bundle.min.js.map',
            ]
        });
        log('jQuery is synced.');
    },

};
