/* ===========================================================================
 * Task         : build_image
 * Description  : Optimize images
 * Note         : Using Gulp v5
 * Package      : npm install --save-dev gulp gulp-load-plugins pump gulp-imagemin imagemin-mozjpeg imagemin-pngquant
 * ===========================================================================*/

/* Common */
const configs = require('./_configs_');

/* Packages */
let argv = {};
(async () => {
    const yargsModule = await import('yargs/yargs');
    const { hideBin } = await import('yargs/helpers');
    argv = yargsModule.default(hideBin(process.argv)).argv;
})();
const { src, dest, lastRun } = require('gulp');
const $ = require('gulp-load-plugins')();
const pump = require('pump');
const log = require('fancy-log');

/* Task configs */
const dir_src = configs.source_dir;
const dir_public = configs.dist_dir;
const image_src = dir_src + '/assets/images/**/*.*';
const image_dest = dir_public + '/assets/images/';

const sharp = require('sharp');

/* Task */
exports.build_image = async function build_image() {

    // Copy images to public folder
    await new Promise((resolve, reject) => {
        pump(
            src(image_src, { since: lastRun(build_image), encoding: false }),
            $.plumber({
                errorHandler: function (error) {
                    log(error.toString());
                    this.emit('end');
                    reject(error);
                },
            }),
            dest(image_dest),
            (err) => {
                if (err) {
                    log(err);
                    reject(err);
                } else {
                    log('Images are copied to public folder.');
                    resolve();
                }
            }
        );
    });

};
