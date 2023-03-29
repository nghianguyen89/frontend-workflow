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

const del = import('del');


exports.build_css = async function build_css() {

    await Promise.resolve(del).then((obj) => {
        obj.deleteSync(configs.css.plugins.dest + '_plugins.scss');
    });

    return pump(
        /* concat all CSS files inside ./src/assets/plugins/ and move to ./src/styles/_plugins.scss */
        src(configs.css.plugins.src),
        $.concat('_plugins.scss'),
        // $.postcss([autoprefixer(), cssnano()]),
        dest(configs.css.plugins.dest),

        /* add varible $image_url before compile scss to css */
        src(configs.css.src),
        $.plumber(configs.onError),
        $.header('$image_url:"' + configs.media_url.local + '";'),

        /* compile scss */
        $.if(configs.env !== 'dev', $.sourcemaps.init()),
        $.sass().on('error', $.sass.logError),
        $.if(configs.env !== 'dev', $.postcss([autoprefixer(), cssnano()])),
        $.if(configs.env !== 'dev', $.rename({ suffix: '.min' })),
        $.if(configs.env !== 'dev', $.sourcemaps.write('.')),
        dest(configs.css.dest),

        /* create css for wordpress embed */
        $.if(configs.env !== 'dev', $.replace(configs.media_url.local, configs.media_url.wordpress)),
        $.if(configs.env !== 'dev', $.rename({
            dirname: './',
            basename: 'style',
            prefix: 'wordpress-',
            suffix: '.min',
            extname: '.css'
        })),
        $.if(configs.env !== 'dev', dest(configs.css.dest)),

        /* notify when compile done */
        $.notify({ message: 'SCSS is compiled to CSS.', onLast: true }),

        /* reload browser for dev */
        $.if(configs.env == 'dev', bs.browsersync_reload)
    );
};
