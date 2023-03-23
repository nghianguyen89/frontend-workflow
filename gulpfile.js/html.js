/* ===========================================================================
 * Task         : build_html
 * Description  : Compile PUG files to HTML files.
 * Note         : Using Gulp v4
 * Package      : npm install --save-dev gulp gulp-load-plugins pump browser-sync
 * Source folder: ./src/views/
 * Build folder : ./build/html/
 * ===========================================================================*/

const configs = require('./configs');
const bs = require('./browser-sync');

const { src, dest } = require('gulp');
const $ = require('gulp-load-plugins')();
const pump = require('pump');

exports.build_html = async function build_html() {
    return pump(
        src(configs.html.src),
        $.plumber(configs.onError),
        $.pug(configs.html.pug_configs),
        dest(configs.html.dest),
        $.notify({ message: 'Pug is compiled to HTML.', onLast: true }),
        bs.browsersync_reload
    );
};
