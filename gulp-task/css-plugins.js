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


/* Task configs */
const dir_src = configs.source_dir;
const dir_public = configs.dist_dir;
const dir_assets = '/' + configs.assets_dir + '/';
const plugins_src = [
    dir_src + '/assets/plugins/normalize/normalize.css',
    // dir_src + '/assets/plugins/bootstrap/bootstrap.min.css',
    dir_src + '/assets/plugins/**/*.css'
];
const plugins_dest = dir_src + '/styles/';


/* Task */
exports.build_css_plugins = async function build_css_plugins() {
    log('░░░░░░░░░░⌛ Start concatenating the plugins CSS files... ░░░░░░░░░░');

    return new Promise((resolve, reject) => {
        pump(
            src(plugins_src),
            $.concat('plugins.scss'),
            $.if(argv.prod, $.postcss([cssnano()])),
            dest(plugins_dest),
            (error) => {
                if (error) {
                    log(error);
                    reject(error);
                } else {
                    log('░░░░░░░░░░ ✓ The plugins CSS files are concatenated. ░░░░░░░░░░\n');
                    resolve();
                }
            }
        );
    });
};
