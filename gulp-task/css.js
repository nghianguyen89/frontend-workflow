/* ===========================================================================
 * Task         : build_css
 * Description  : Compile application SCSS without rebuilding the JS bundle.
 * ===========================================================================*/

'use strict';

const { src, dest } = require('gulp');
const { sass } = require('gulp5-sass-plugin');
const $ = require('gulp-load-plugins')();
const pump = require('pump');
const log = require('fancy-log');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const configs = require('./_configs_');

const source = `${configs.source_dir}/styles/styles.scss`;
const output = `${configs.dist_dir}/${configs.static.css}/`;

exports.build_css = async function build_css() {
    log('░░░░░░░░░░⌛ Start compiling SCSS... ░░░░░░░░░░');

    return new Promise((resolve, reject) => {
        pump(
            src(source, { sourcemaps: true }),
            $.plumber({
                errorHandler(error) {
                    log(error.toString());
                    this.emit('end');
                    reject(error);
                },
            }),
            sass({ outputStyle: 'expanded' }).on('error', sass.logError),
            $.postcss([autoprefixer(), cssnano()]),
            $.rename({ basename: 'styles', suffix: '.min' }),
            dest(output, { sourcemaps: '.' }),
            (error) => {
                if (error) {
                    reject(error);
                    return;
                }

                log('░░░░░░░░░░ ✔ SCSS compiled; BrowserSync can inject the CSS change. ░░░░░░░░░░');
                resolve();
            }
        );
    });
};
