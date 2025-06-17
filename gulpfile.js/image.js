/* ===========================================================================
 * Task         : build_image
 * Description  : Optimize images
 * Note         : Using Gulp v4
 * Package      : npm install --save-dev gulp gulp-load-plugins pump gulp-imagemin imagemin-mozjpeg imagemin-pngquant
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
const log = require('fancy-log');


/* Task configs */
const dir_src = configs.source_dir;
const dir_public = configs.dist_dir;
const image_src = dir_src + '/assets/images/**/*.*';
const image_dest = dir_public + '/assets/images/';
let imagemin, mozjpeg, pngquant;
const start_imagemin = async () => {
    imagemin = (await import('gulp-imagemin')).default;
    mozjpeg = (await import('imagemin-mozjpeg')).default;
    pngquant = (await import('imagemin-pngquant')).default;
};


/* Task */
exports.build_image = async function build_image() {
    await start_imagemin();

    return pump(
        src(image_src, { since: lastRun(build_image) }),
        $.plumber({
            errorHandler: function (error) {
                log(error.toString());
                this.emit('end');
            }
        }),
        dest(image_dest),
        function (err) {
            if (typeof err !== 'undefined')
                log(err);
            else {
                log('Images is copied to public folder.');

                if (argv == 'prod') {
                    pump(
                        src(image_dest),
                        $.plumber({
                            errorHandler: function (error) {
                                log(error.toString());
                                this.emit('end');
                            }
                        }),
                        imagemin(
                            [
                                pngquant({ quality: [0.7, 0.7] }),
                                mozjpeg({ quality: 70 })
                            ],
                            {
                                progressive: true,
                                verbose: true
                            }
                        ),
                        dest(image_dest),
                        function (err) {
                            if (typeof err !== 'undefined')
                                log(err);
                            else
                                log('Image optimization is completed.')
                        }
                    );
                }
            }
        }
    );
};
