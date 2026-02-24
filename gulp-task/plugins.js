/* ===========================================================================
 * Task         : build_plugins
 * Description  : Compile SCSS files to CSS files.
 * ===========================================================================*/

/* Common */
const configs = require('./_configs_');

/* Packages */
const { src, dest } = require('gulp');
const $ = require('gulp-load-plugins')({});
const pump = require('pump');
const log = require('fancy-log');
const cssnano = require('cssnano');


/* Task configs */
const dir_src = configs.source_dir;
const dir_public = configs.dist_dir;
const dir_assets = '/' + configs.assets_dir + '/';
const plugins_src = [
    dir_src + '/assets/plugins/normalize/normalize.css',
    dir_src + '/assets/plugins/**/*.css'
];
const plugins_dest = dir_public + '/assets/';

const media_url_local = '../images';
const media_url_cms = '../../../../uploads';


/* Task */
exports.build_plugins = async function build_plugins() {
    log('░░░░░░░░░░⌛ Start concatenating the plugins CSS files... ░░░░░░░░░░');
    await new Promise((resolve, reject) => {
        pump(
            src(plugins_src),
            $.concat('plugins.min.css'),
            $.postcss([cssnano()]),
            dest(plugins_dest + 'css/'),
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

    log('░░░░░░░░░░⌛ Start concatenating the plugins JS files... ░░░░░░░░░░');
    await new Promise((resolve, reject) => {
        pump(
            src(plugins_src),
            $.concat('plugins.js'),
            dest(plugins_dest + 'js/'),
            (error) => {
                if (error) {
                    log(error);
                    reject(error);
                } else {
                    log('░░░░░░░░░░ ✓ The plugins JS files are concatenated. ░░░░░░░░░░\n');
                    resolve();
                }
            }
        );
    });

    // Copy to Wordpress CSS
    // log('░░░░░░░░░░⌛ Start convert to Wordpress CSS... ░░░░░░░░░░');
    // await new Promise((resolve, reject) => {
    //     pump(
    //         src(plugins_dest + 'plugins.css', { sourcemaps: true }),
    //         $.plumber({
    //             errorHandler: function (error) {
    //                 log(error.toString());
    //                 this.emit('end');
    //                 reject(error);
    //             }
    //         }),
    //         $.replace(media_url_local, media_url_cms),
    //         $.rename({ prefix: 'wordpress-' }),
    //         dest(dir_src + '/_cms_/' + configs.project_name + '/assets/css', { sourcemaps: '.' }),
    //         (error) => {
    //             if (error) {
    //                 log(error);
    //                 reject(error);
    //             } else {
    //                 log('░░░░░░░░░░ ✔ Wordpress CSS files done ░░░░░░░░░░');
    //                 resolve();
    //             }
    //         }
    //     );
    // });

};
