/* folder name */
const dir = {
    source: 'src',
    dest: 'build',
    html: 'build/html',
    public: 'build/html',
    theme_wp: 'build/themes',
};

const path = {
    assets: '/assets/',
    pugs: '/views/',
    styles: '/styles/',
    scripts: '/scripts/',
    images: '/assets/images/',
    plugins: '/assets/plugins/',
};

/* paths */
const dir_src = dir.source;

const src_pugs = dir_src + path.pugs;
const src_styles = dir_src + path.styles;
const src_scripts = dir_src + path.scripts;
const src_scripts_plugins = src_scripts + 'plugins/';
const src_images = dir_src + path.images;
const src_assets = dir_src + path.assets;
const src_assets_plugins = dir_src + path.plugins;

const html_assets = dir.html + path.assets;
const html_images = dir.html + path.images;

const theme_assets = dir.theme_wp + path.assets;

/* varible environtment */
const argv = require('yargs').argv;
const env = argv.production ? 'production' : argv.stage ? 'stage' : argv.wp ? 'wp' : 'dev';
const production = argv.production ? true : false;

/* shorthand console.log */
// const log = console.log.bind(console);

const $ = require('gulp-load-plugins');
const log = require('fancy-log');

/* export configs */
module.exports = {
    production: production,
    env: env,
    log: log,
    onError: (err) => {
        // $.notify({
        //     title: 'Gulp Task Error',
        //     subtitle: 'Plugin: <%= error.plugin %>',
        //     message: 'Check the console.'
        // }).write(err);

        log.error(err.toString());

        // this.emit('end');
    },
    dir: {
        public: dir.public,
        build: dir.dest,
    },
    html: {
        watch: [
            src_pugs + '**/*.pug'
        ],
        src: [
            src_pugs + '**/*.pug',
            '!' + src_pugs + 'blocks/**',
            '!' + src_pugs + 'layout/**',
        ],
        dest: dir.html,
        pug_configs: {
            data: {
                env: env,
            },
            pretty: true,
            basedir: src_pugs,
            verbose: production,
        },
    },
    css: {
        watch: [
            src_styles + '**/*.scss',
            src_styles + '!bootstrap/**',
            '!' + src_styles + '_plugins.scss'
        ],
        plugins: {
            src: [
                src_assets_plugins + 'normalize/normalize.css',
                src_assets_plugins + 'bootstrap/bootstrap.min.css',
                src_assets_plugins + '**/*.css'
            ],
            dest: src_styles,
        },
        src: [
            src_styles + '*.scss'
        ],
        dest: html_assets + 'css/',
        dest_wp: theme_assets + 'css/',
        sass_configs: {
            postRequireTransforms: {
                sass: (sass) => {
                    return sass(require('sass'));
                },
            },
            rename: {
                'gulp-concat-css': 'concatCss',
            },
        },
    },
    js: {
        watch: [
            src_scripts + '**/*.js'
        ],
        src: [
            src_assets_plugins + 'jquery/jquery.min.js',
            src_assets_plugins + 'jquery/jquery-migrate.min.js',
            src_assets_plugins + 'bootstrap/bootstrap.bundle.min.js',
            src_assets_plugins + '**/*.js',
            src_scripts + 'configs.js',
            src_scripts + 'detect/**/*.js',
            src_scripts + 'functions/**/*.js',
            src_scripts + 'template.js',
            src_scripts + 'pages/**/*.js',
            '!' + src_scripts + '**/_*.js'
        ],
        dest: html_assets + 'js/',
    },
    image: {
        watch: [
            src_images + '**/*.*'
        ],
        src: [
            src_images + '**/*.*'
        ],
        dest: html_images,
    },
    sync_assets: {
        watch: [
            src_assets + '**/*.*'
        ],
        src: src_assets,
        dest: html_assets,
        sync_configs: {
            rename: {
                'gulp-file-sync': 'fileSync',
            },
        }
    },
    copy_assets: {
        src: [
            src_assets_plugins + '**/*.*'
        ],
        dest: html_assets,
        base: src_assets
    },
    delete_dir: {
        all: dir.dest,
        html: dir.html,
        css: html_assets + 'css',
        js: html_assets + 'js',
        image: html_assets + 'images',
    },
    media_url: {
        local: '../images',
        wordpress: '../../../uploads',
    }
};
