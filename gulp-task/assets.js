/* ===========================================================================
 * Task         : copy_assets
 * Description  : Copy/Sync all file in folder source to build
 * Note         : Using Gulp v5
 * Package      : npm install --save-dev gulp gulp-load-plugins pump gulp-file-sync
 * ===========================================================================*/

/* Common */
const configs = require('./_configs_');

/* Packages */
const $ = require('gulp-load-plugins')({
    rename: {
        'gulp-file-sync': 'fileSync'
    }
});
const log = require('fancy-log');

/* Task configs */
const dir_src = configs.source_dir;
const dir_public = configs.dist_dir;
const dir_assets = '/' + configs.assets_dir + '/';

const assets_src = dir_src + dir_assets;
const assets_dist = dir_public + dir_assets;

/* Task */
module.exports = {

    sync_fonts: async function () {
        try {
            await $.fileSync(
                assets_src + 'fonts/',
                assets_dist + 'fonts/'
            );
            log('Fonts are synced.');
        } catch (err) {
            log('Error syncing fonts:', err);
        }
    },

    sync_images: async function () {
        try {
            await $.fileSync(
                assets_src + 'images/',
                assets_dist + 'images/'
            );
            log('Images are synced.');
        } catch (err) {
            log('Error syncing images:', err);
        }
    },

    sync_plugins: async function () {
        try {
            await $.fileSync(
                assets_src + 'plugins/jquery/',
                assets_dist + 'js/',
                {
                    ignore: [
                        'bundle.js',
                        'bundle.js.map',
                        'bundle.min.js',
                        'bundle.min.js.map'
                    ]
                }
            );
            log('jQuery plugins are synced.');
        } catch (err) {
            log('Error syncing jQuery plugins:', err);
        }
    }

};