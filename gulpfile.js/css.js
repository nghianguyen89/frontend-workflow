/* ===========================================================================
 * Task         : build_css
 * Description  : Compile SCSS files to CSS files.
 * Note         : Using Gulp v4
 * Package      : npm install --save-dev gulp gulp-load-plugins pump browser-sync cssnano autoprefixer
 * ===========================================================================*/

/* Common */
const configs = require('./_configs_');

/* Packages */
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const { src, dest } = require('gulp');
const $ = require('gulp-load-plugins')({
    postRequireTransforms: {
        sass: (sass) => {
            return sass(require('sass'));
        },
    },
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
const plugins_src = [
    dir_src + '/assets/plugins/normalize/normalize.css',
    // dir_src + '/assets/plugins/bootstrap/bootstrap.min.css',
    dir_src + '/assets/plugins/**/*.css'
];
const plugins_dest = dir_src + '/styles/';
const css_src = dir_src + '/styles/*.scss';
const css_dest = dir_public + '/assets/css/';

const media_url_local = '../images';
const media_url_wordpress = '../../../../uploads';


/* Task */
exports.build_css = async function build_css() {
    log('░░░░░░░░░░⌛ Start concatenating the plugins CSS files... ░░░░░░░░░░');

    return new Promise((resolve, reject) => {

        pump(
            src(plugins_src),
            $.concat('_plugins.scss'),
            dest(plugins_dest),
            (error) => {
                if (error)
                    log(err);
                else
                    log('░░░░░░░░░░ ✓ The plugins CSS files is concatenated. ░░░░░░░░░░\n');
            }
        ).on('end', resolve);

    }).then(

        (result) => {
            log('░░░░░░░░░░⌛ Start compiling .SCSS files... ░░░░░░░░░░');

            pump(
                src(css_src, { sourcemaps: true }),
                $.plumber({
                    errorHandler: function (error) {
                        log(error.toString());
                        this.emit('end');
                    }
                }),
                $.header('$image_url:"' + media_url_local + '";'),
                $.sass().on('error', $.sass.logError),
                $.if(argv == 'prod', $.postcss([autoprefixer(), cssnano()])),
                $.rename({ suffix: '.min' }),
                dest(css_dest, { sourcemaps: '.' }),
                (error) => {
                    if (error)
                        log(error);
                    else
                        log('░░░░░░░░░░ ✔ .SCSS files have been compiled to .CSS ░░░░░░░░░░');
                }
            );

            setTimeout(function(){
                log('░░░░░░░░░░⌛ Start convert to Wordpress CSS... ░░░░░░░░░░');
                
                pump(
                    src(css_dest + 'styles.min.css', { sourcemaps: true }),
                    $.plumber({
                        errorHandler: function (error) {
                            log(error.toString());
                            this.emit('end');
                        }
                    }),
                    $.replace(media_url_local, media_url_wordpress),
                    $.rename({ prefix: 'wordpress-' }),
                    dest(dir_src + '/wp_themes/assets/css', { sourcemaps: '.' }),
                    (error) => {
                        if (error)
                            log(error);
                        else
                            log('░░░░░░░░░░ ✔ Wordpress CSS files done ░░░░░░░░░░');
                    }
                );
            }, 1500);
        },
        (error) => {
            log(error);
        }

    );
};
