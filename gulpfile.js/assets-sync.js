/* ===========================================================================
 * Task         : sync_assets
 * Description  : Sync all file in folder plugins
 * Note         : Using Gulp v4
 * Package      : npm install --save-dev gulp-load-plugins gulp-file-sync
 * ===========================================================================*/

const configs = require('./configs');
const log = require('fancy-log');

const $ = require('gulp-load-plugins')(configs.sync_assets.sync_configs);

exports.sync_assets = async function sync_assets() {
    $.fileSync(
        configs.sync_assets.src,
        configs.sync_assets.dest,
        {
            addFileCallback: function (fullPathSrc, fullPathDest) {
                log('File added in: ' + fullPathSrc);
                log('<=> Synchronized with: ' + fullPathDest);
                log('-------------------------');
            },
            deleteFileCallback: function (fullPathSrc, fullPathDest) {
                log('File deleted in: ' + fullPathSrc);
                log('<=> Synchronized with: ' + fullPathDest);
                log('-------------------------');
            },
            updateFileCallback: function (fullPathSrc, fullPathDest) {
                log('File modified in: ' + fullPathSrc);
                log('<=> Synchronized with: ' + fullPathDest);
                log('-------------------------');
            },
        }
    );
}
