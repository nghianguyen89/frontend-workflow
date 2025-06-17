/* ===========================================================================
 * Task         : build_js
 * Description  : Concat javascript files and minify
 * Note         : Using Gulp v5
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
    await new Promise((resolve, reject) => {
        pump(
            [
                src(script_src, { sourcemaps: true }),
                $.plumber({
                    errorHandler: function (error) {
                        log(error.toString());
                        this.emit('end');
                        reject(error);
                    }
                }),
                // $.babel({
                //     presets: ['@babel/env']
                // }),
                $.concat('bundle.js', { newLine: ';' }),
                $.if(argv.prod, $.uglify()),
                $.rename({ suffix: '.min' }),
                dest(script_html, { sourcemaps: '.' })
            ],
            (err) => {
                if (err) {
                    log(err);
                    reject(err);
                } else {
                    log('JS files are concatenated & minified.');
                    resolve();
                }
            }
        );
    });

    // Copy to WordPress theme (if needed)
    await new Promise((resolve, reject) => {
        pump(
            [
                src([
                    script_html + 'bundle.min.js',
                    script_html + 'bundle.min.js.map'
                ]),
                dest(dir_src + '/wp_themes/assets/js/')
            ],
            (err) => {
                if (err) {
                    log(err);
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
};
