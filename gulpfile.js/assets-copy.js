/* ===========================================================================
 * Task         : copy_assets
 * Description  : Copy all file in folder ./src/assets to ./build/html/assets
 * Note         : Using Gulp v4
 * Package      : npm install --save-dev gulp gulp-load-plugins pump
 * ===========================================================================*/

const configs = require('./configs');

const { src, dest } = require('gulp');
const $ = require('gulp-load-plugins')();
const pump = require('pump');

exports.copy_assets = async function copy_assets() {
    return pump(
        src(
            configs.copy_assets.src,
            { base: configs.copy_assets.base }
        ),
        dest(configs.copy_assets.dest),
        $.notify({ message: 'Copied assets folder from ./src/ to ./build/', onLast: true })
    );
}
