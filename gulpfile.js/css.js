/* ===========================================================================
 * Task         : build_css
 * Description  : Compile SCSS files to CSS files.
 * Note         : Using Gulp v4
 * Package      : npm install --save-dev gulp gulp-load-plugins pump browser-sync cssnano autoprefixer
 * Source folder: ./src/styles/
 * Build folder : ./build/assets/css/
 * ===========================================================================*/

const configs = require('./configs');
const bs = require('./browser-sync');

const { src, dest } = require('gulp');
const $ = require('gulp-load-plugins')(configs.css.sass_configs);
const pump = require('pump');

const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

exports.build_css = async function build_css() {
    return pump(
        src(configs.css.src),
        $.plumber(configs.onError),
        $.header('$image_url:"' + configs.media_url.local + '";'),

        $.if(configs.env !== 'dev', $.sourcemaps.init()),
        $.sass().on('error', $.sass.logError),
        $.if(configs.env !== 'dev', $.postcss([autoprefixer(), cssnano()])),
        $.if(configs.env !== 'dev', $.rename({ suffix: '.min' })),
        $.if(configs.env !== 'dev', $.sourcemaps.write('.')),
        dest(configs.css.dest),

        $.if(configs.env !== 'dev', $.replace(configs.media_url.local, configs.media_url.wordpress)),
        $.if(configs.env !== 'dev', $.rename({
            dirname: './',
            basename: 'style',
            prefix: 'wordpress-',
            suffix: '.min',
            extname: '.css'
        })),
        $.if(configs.env !== 'dev', dest(configs.css.dest)),

        $.notify({ message: 'SCSS is compiled to CSS.', onLast: true }),

        $.if(configs.env == 'dev', bs.browsersync_reload)
    );
};
