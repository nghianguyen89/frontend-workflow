/* ===========================================================================
 * Task         : build_js
 * Description  : Concat javascript files and minify
 * Note         : Using Gulp v4
 * Package      : npm install --save-dev gulp gulp-load-plugins pump
 * ===========================================================================*/

const configs = require('./configs');
const bs = require('./browser-sync');

const { src, dest } = require('gulp');
const $ = require('gulp-load-plugins')();
const pump = require('pump');


exports.build_js = async function build_js() {
    return pump(
        src(configs.js.src),
        $.concat('bundle.js', { newLine: ';' }),

        $.if(configs.env !== 'dev', $.uglify()),
        $.if(configs.env !== 'dev', $.rename({ suffix: '.min' })),

        dest(configs.js.dest),
        $.notify({ message: 'JS files is concatenated & minified.', onLast: true }),

        $.if(configs.env == 'dev', bs.browsersync_reload)
    );
};
