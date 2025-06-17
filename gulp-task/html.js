/* ===========================================================================
 * Task         : build_html
 * Description  : Compile PUG files to HTML files.
 * Note         : Using Gulp v5
 * Package      : npm install --save-dev gulp gulp-load-plugins pump browser-sync
 * ===========================================================================*/

/* Common */
const configs = require('./_configs_');

/* Packages */
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const { src, dest, lastRun } = require('gulp');
const $ = require('gulp-load-plugins')();
const pump = require('pump');
const browserSync = require('./browser-sync');
const log = require('fancy-log');
const _path = require('path');


/* Task configs */
const dir_src = configs.source_dir;
const dir_public = configs.dist_dir;
const pug_src = [
    dir_src + '/views/**/*.pug',
    '!' + dir_src + '/views/_**/**/*.pug',
];
const pug_dest = dir_public;
const pug_configs = {
    data: {
        env: argv,
    },
    pretty: true,
    basedir: dir_src + '/views/',
    verbose: argv.prod ? true : false,
};

// log(configs.dist_cms.wordpress.css);
log(configs.dist.css);

/* Task */
exports.build_html = async function build_html() {
    log('░░░░░░░░░░⌛ Start compiling .PUG files... ░░░░░░░░░░');

    return new Promise((resolve, reject) => {
        pump(
            src(pug_src, { since: lastRun(exports.build_html) }),
            $.plumber({
                errorHandler: function (error) {
                    log(error.toString());
                    this.emit('end');
                    reject(error);
                }
            }),
            $.data(function (file) {
                pug_configs['relativePath'] = _path.relative(
                    file.base,
                    file.path.replace(/.pug$/, '.html')
                );
                return pug_configs;
            }),
            $.pug({
                data: pug_configs.data.env,
                pretty: pug_configs.pretty,
                basedir: pug_configs.basedir,
                verbose: pug_configs.verbose,
            }),
            $.tap(file => {
                // Log relative output path (cross-platform)
                log(_path.relative(process.cwd(), file.path));
            }),
            dest(pug_dest),
            (error) => {
                if (error) {
                    log(error);
                    reject(error);
                } else {
                    log('░░░░░░░░░░ ✔ .PUG files have been compiled to .HTML ░░░░░░░░░░');
                    browserSync.reload();
                    resolve();
                }
            }
        );
    });
};
