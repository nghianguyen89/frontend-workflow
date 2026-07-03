'use strict';

const path = require('path');

function getArg(name, fallback) {
    const prefix = `--${name}=`;
    const item = process.argv.find((arg) => arg === `--${name}` || arg.startsWith(prefix));

    if (!item) return fallback;
    if (item === `--${name}`) return true;

    return item.slice(prefix.length);
}

function parseList(value) {
    if (Array.isArray(value)) return value;
    if (!value) return [];

    return String(value)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

function resolvePluginList(registry, requested) {
    const resolved = [];
    const seen = new Set();

    function add(name) {
        if (seen.has(name)) return;

        const plugin = registry[name];
        if (!plugin) return;

        seen.add(name);
        (plugin.depends || []).forEach(add);
        resolved.push(name);
    }

    requested.forEach(add);

    return resolved;
}

function posixPath(...items) {
    return items
        .filter(Boolean)
        .join('/')
        .replace(/\\/g, '/')
        .replace(/\/+/g, '/');
}

const project_name = getArg('project', process.env.PROJECT_NAME || 'wp_themes');
const project_cms = getArg('cms', process.env.CMS || 'wordpress');
const is_prod = process.argv.includes('--prod') || process.env.NODE_ENV === 'production';

const source_dir = 'src';
const dist_dir = 'dist';
const assets_dir = 'assets';

const static_target = {
    root: dist_dir,
    css: posixPath(assets_dir, 'css'),
    js: posixPath(assets_dir, 'js'),
    images: posixPath(assets_dir, 'images'),
    fonts: posixPath(assets_dir, 'fonts'),
};

const cms_targets = {
    default: {
        enabled: false,
        root: '',
        css: '',
        js: '',
        images: '',
        fonts: '',
        files: {},
        sync: {
            images: false,
            fonts: false,
        },
    },

    wordpress: {
        enabled: true,
        root: posixPath(source_dir, '_cms_', project_name),
        css: 'assets/css',
        js: 'assets/js',
        images: 'assets/images',
        fonts: 'assets/fonts',
        sync: {
            images: false,
            fonts: false,
        },
        files: {
            css: [
                { from: 'styles.min.css', to: 'wordpress-styles.min.css' },
                { from: 'plugins.min.css', to: 'wordpress-plugins.min.css' },
            ],
            js: [
                { from: 'bundle.min.js', to: 'bundle.min.js' },
                { from: 'bundle.min.js.map', to: 'bundle.min.js.map' },
            ],
        },
    },

    'ec-cube': {
        enabled: false,
        root: posixPath(source_dir, '_cms_', project_name),
        css: 'html/template/default/assets/css',
        js: 'html/template/default/assets/js',
        images: 'html/template/default/assets/images',
        fonts: 'html/template/default/assets/fonts',
        sync: {
            images: false,
            fonts: false,
        },
        files: {
            css: [
                { from: 'styles.min.css', to: 'styles.min.css' },
                { from: 'plugins.min.css', to: 'plugins.min.css' },
            ],
            js: [
                { from: 'bundle.min.js', to: 'bundle.min.js' },
                { from: 'bundle.min.js.map', to: 'bundle.min.js.map' },
            ],
        },
    },

    lancelot: {
        enabled: false,
        root: dist_dir,
        css: 'css',
        js: 'js',
        images: 'lancelot/common_files/images/public',
        fonts: 'fonts',
        sync: {
            images: false,
            fonts: false,
        },
        files: {
            css: [
                { from: 'styles.min.css', to: 'styles.min.css' },
                { from: 'plugins.min.css', to: 'plugins.min.css' },
            ],
            js: [
                { from: 'bundle.min.js', to: 'bundle.min.js' },
                { from: 'bundle.min.js.map', to: 'bundle.min.js.map' },
            ],
        },
    },
};

const cms_target = cms_targets[project_cms] || cms_targets.default;

const plugin_registry = {
    normalize: {
        styles: [{ type: 'npm', path: 'normalize.css/normalize.css' }],
    },
    animate: {
        styles: [{ type: 'npm', path: 'animate.css/animate.min.css' }],
        scripts: [
            { type: 'npm', path: 'wowjs/dist/wow.min.js' },
            { type: 'npm-global', path: 'animejs', importName: 'anime', expose: ['anime'], namespaceImport: true },
        ],
    },
    bootstrap: {
        styles: [{ type: 'npm', path: 'bootstrap/dist/css/bootstrap.min.css' }],
        scripts: [{ type: 'npm', path: 'bootstrap/dist/js/bootstrap.bundle.js' }],
    },
    chartjs: {
        scripts: [
            { type: 'npm-global', path: 'chart.js/auto', importName: 'Chart', expose: ['Chart'] },
            { type: 'npm-global', path: 'chartjs-plugin-datalabels', importName: 'ChartDataLabels', expose: ['ChartDataLabels'], after: 'Chart.register(ChartDataLabels);' },
        ],
    },
    datatables: {
        depends: ['jquery'],
        styles: [{ type: 'npm', path: 'datatables.net-dt/css/dataTables.dataTables.min.css' }],
        scripts: [{ type: 'npm', path: 'datatables.net-dt' }],
    },
    fancyapps: {
        styles: [
            { type: 'npm', path: '@fancyapps/ui/dist/fancybox/fancybox.css' },
            { type: 'npm', path: '@fancyapps/ui/dist/carousel/carousel.css' },
            { type: 'npm', path: '@fancyapps/ui/dist/carousel/carousel.autoplay.css' },
        ],
        scripts: [{ type: 'npm-global', path: '@fancyapps/ui', importName: 'fancyapps', exposeNamespace: true }],
    },
    'floating-totop-button': {
        depends: ['jquery'],
        styles: [{ type: 'legacy', path: 'floating-totop-button/floating-totop-button-tiny.min.css' }],
        scripts: [{ type: 'legacy', path: 'floating-totop-button/floating-totop-button.min.js' }],
    },
    hamburgers: {
        styles: [{ type: 'npm', path: 'hamburgers/dist/hamburgers.min.css' }],
    },
    imagemapster: {
        depends: ['jquery'],
        scripts: [{ type: 'npm', path: 'imagemapster' }],
    },
    jarallax: {
        styles: [{ type: 'npm', path: 'jarallax/dist/jarallax.min.css' }],
        scripts: [{ type: 'npm-global', path: 'jarallax', importName: 'jarallaxModule', exposeNamespace: true }],
    },
    jquery: {
        scripts: [
            { type: 'npm-global', path: 'jquery', importName: 'jQuery', expose: ['jQuery', '$'], phase: 'prelude' },
            { type: 'npm', path: 'jquery-migrate' },
        ],
    },
    'jquery-inview': {
        depends: ['jquery'],
        scripts: [{ type: 'npm', path: 'jquery-inview' }],
    },
    'jquery-ui--datepicker': {
        depends: ['jquery'],
        styles: [{ type: 'npm', path: 'jquery-ui-dist/jquery-ui.min.css' }],
        scripts: [{ type: 'npm', path: 'jquery-ui-dist/jquery-ui.min.js' }],
        assets: [{ type: 'npm', from: 'jquery-ui-dist/images', to: 'images' }],
    },
    'jquery-zip2': {
        depends: ['jquery'],
        scripts: [{ type: 'legacy', path: 'jquery-zip2/jquery.zip2addr.js' }],
    },
    odometer: {
        styles: [{ type: 'npm', path: 'odometer/themes/odometer-theme-default.css' }],
        scripts: [{ type: 'npm', path: 'odometer/odometer.min.js' }],
    },
    'perfect-scrollbar': {
        styles: [{ type: 'npm', path: 'perfect-scrollbar/css/perfect-scrollbar.css' }],
        scripts: [{ type: 'npm-global', path: 'perfect-scrollbar', importName: 'PerfectScrollbar', expose: ['PerfectScrollbar'] }],
    },
    swiper: {
        styles: [{ type: 'npm', path: 'swiper/swiper-bundle.min.css' }],
        scripts: [{ type: 'npm-global', path: 'swiper/bundle', importName: 'Swiper', expose: ['Swiper'] }],
    },
    wanakana: {
        scripts: [{ type: 'npm-global', path: 'wanakana', importName: 'wanakana', expose: ['wanakana'], namespaceImport: true }],
    },
};

const default_plugins = Object.keys(plugin_registry);
const configured_plugins = parseList(getArg('plugins', process.env.PLUGINS));
const active_plugins = resolvePluginList(
    plugin_registry,
    configured_plugins.length ? configured_plugins : default_plugins
);

module.exports = {
    env: is_prod ? 'prod' : 'dev',
    production: is_prod,
    project_name,
    project_cms,
    source_dir,
    dist_dir,
    assets_dir,
    static: static_target,
    cms: cms_target,
    paths: {
        root: process.cwd(),
        source: path.resolve(source_dir),
        dist: path.resolve(dist_dir),
    },
    files: {
        css: {
            app: 'styles.min.css',
            plugins: 'plugins.min.css',
        },
        js: {
            app: 'bundle.min.js',
        },
    },
    plugins: {
        active: active_plugins,
        registry: plugin_registry,
    },
    browser_sync: {
        port: 4200,
        browsers: ['firefox'],
        use_https: false,
        ssl_cert: {
            key: 'C:/xampp/apache/conf/ssl.key/localhost.key',
            cert: 'C:/xampp/apache/conf/ssl.pem/localhost.pem',
        },
    },
};
