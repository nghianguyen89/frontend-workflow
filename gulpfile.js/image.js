/* ===========================================================================
 * Task         : build_image
 * Description  : Optimize images
 * Note         : Using Gulp v4
 * Package      : npm install --save-dev gulp gulp-load-plugins pump gulp-imagemin imagemin-mozjpeg imagemin-pngquant
 * ===========================================================================*/

const configs = require('./configs');
const bs = require('./browser-sync');

const { src, dest } = require('gulp');
const $ = require('gulp-load-plugins')();
const pump = require('pump');

let imagemin, mozjpeg, pngquant;
const start_imagemin = async () => {
    imagemin = (await import('gulp-imagemin')).default;
    mozjpeg = (await import('imagemin-mozjpeg')).default;
    pngquant = (await import('imagemin-pngquant')).default;
};

exports.build_image = async function build_image() {
    await start_imagemin();

    if (configs.production) {
        return pump(
            src(configs.image.src),
            $.plumber(configs.onError),
            imagemin(
                [pngquant({ quality: [0.7, 0.7] }), mozjpeg({ quality: 70 })],
                { progressive: true, verbose: true }
            ),
            dest(configs.image.dest),
            $.notify({ message: 'Image optimization is completed', onLast: true })
        );
    } else {
        return pump(
            src(configs.image.src),
            $.plumber(configs.onError),
            $.changed(configs.image.dest),
            dest(configs.image.dest),
            $.notify({ message: 'Copy image is completed', onLast: true }),
            bs.browsersync_reload
        );
    }
};
