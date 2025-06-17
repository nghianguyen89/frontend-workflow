/* ===========================================================================
 * Task         : build_css
 * Description  : Compile SCSS files to CSS files.
 * Note         : Using Gulp v5
 * Package      : npm install --save-dev gulp gulp-load-plugins pump browser-sync cssnano autoprefixer
 * ===========================================================================*/

/* Common */
const configs = require('./_configs_');

/* Packages */
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const { src, dest } = require('gulp');
const { sass } = require('gulp5-sass-plugin');
const $ = require('gulp-load-plugins')({
    rename: {
        'gulp-concat-css': 'concatCss',
    },
});
const pump = require('pump');
const log = require('fancy-log');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

/* Task configs */
const dir_src = configs.source_dir;
const dir_public = configs.dist_dir;
const dir_assets = `/${configs.assets_dir}/`;
const plugins_src = [
    `${dir_src}/assets/plugins/normalize/normalize.css`,
    `${dir_src}/assets/plugins/**/*.css`,
];
const plugins_dest = `${dir_src}/styles/`;
const css_src = `${dir_src}/styles/*.scss`;
const css_dest = `${dir_public}${dir_assets}css/`;

const media_url_local = '../images';
const media_url_cms = '../../../../uploads';

/* Task */
// ...existing code...

exports.build_css = async function build_css() {
    log('░░░░░░░░░░⌛ Start compiling .SCSS files... ░░░░░░░░░░');

    // Compile SCSS
    await new Promise((resolve, reject) => {
        pump(
            src(css_src, { sourcemaps: true }),
            $.plumber({
                errorHandler: function (error) {
                    log(error.toString());
                    this.emit('end');
                    reject(error);
                }
            }),
            $.header(`$image_url:"${media_url_local}";`),
            sass({
                outputStyle: 'expanded',
                indentWidth: 4,
            }).on('error', sass.logError),
            $.if(argv.prod, $.postcss([autoprefixer(), cssnano()])),
            $.rename({ suffix: '.min' }),
            dest(css_dest, { sourcemaps: '.' }),
            (error) => {
                if (error) {
                    log(error);
                    reject(error);
                } else {
                    log('░░░░░░░░░░ ✔ .SCSS files have been compiled to .CSS ░░░░░░░░░░');
                    resolve();
                }
            }
        );
    });

    // Convert to Wordpress CSS
    log('░░░░░░░░░░⌛ Start convert to Wordpress CSS... ░░░░░░░░░░');
    await new Promise((resolve, reject) => {
        pump(
            src(css_dest + 'styles.min.css', { sourcemaps: true }),
            $.plumber({
                errorHandler: function (error) {
                    log(error.toString());
                    this.emit('end');
                    reject(error);
                }
            }),
            $.replace(media_url_local, media_url_cms),
            $.rename({ prefix: 'wordpress-' }),
            dest(dir_src + '/wp_themes/assets/css', { sourcemaps: '.' }),
            (error) => {
                if (error) {
                    log(error);
                    reject(error);
                } else {
                    log('░░░░░░░░░░ ✔ Wordpress CSS files done ░░░░░░░░░░');
                    resolve();
                }
            }
        );
    });
};