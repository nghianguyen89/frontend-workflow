/* ===========================================================================
 * Task         : build_js
 * Description  : Concat javascript files and minify
 * Note         : Using Gulp v4
 * Package      : npm install --save-dev gulp gulp-load-plugins pump
 * ===========================================================================*/

/* Common */
const configs = require('./_configs_');

/* Packages */
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const { src, dest } = require('gulp');
const $ = require('gulp-load-plugins')();
const pump = require('pump');
const log = require('fancy-log');


/* Task configs */
const dir_src = configs.source_dir;
const dir_public = configs.dist_dir;
const script_src = [
    dir_src + '/assets/plugins/**/*.js',
    dir_src + '/scripts/configs.js',
    dir_src + '/scripts/detect/**/*.js',
    dir_src + '/scripts/functions/**/*.js',
    dir_src + '/scripts/template.js',
    dir_src + '/scripts/pages/**/*.js',
    '!' + dir_src + '/scripts/**/_*.js',
    '!' + dir_src + '/assets/plugins/jquery/jquery.min.js',
    '!' + dir_src + '/assets/plugins/jquery/jquery-migrate.min.js',
];
const script_html = dir_public + '/assets/js/';


/* Task */
exports.build_js = async function build_js() {
    pump(
        src(script_src, { sourcemaps: true }),
        $.plumber({
            errorHandler: function (error) {
                log(error.toString());
                this.emit('end');
            }
        }),
        // $.babel({
        //     presets: ['@babel/env']
        // }),
        $.concat('bundle.js', { newLine: ';' }),
        $.if(argv == 'prod', $.uglify()),
        $.rename({ suffix: '.min' }),
        dest(script_html, { sourcemaps: '.' }),
        function (err) {
            if (typeof err !== 'undefined')
                log(err);
            else
                log('JS files is concatenated & minified.')
        }
    );

    setTimeout(function(){        
        pump(
            src([
                script_html + 'bundle.min.js',
                script_html + 'bundle.min.js.map'
            ]),
            dest(dir_src + '/wp_themes/assets/js/'),
        );
    }, 1500);
};
