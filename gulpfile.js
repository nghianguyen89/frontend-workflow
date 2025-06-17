'use strict';

/* Packages */
const browserSync = require('./gulp-task/browser-sync');
const { series, parallel } = require('gulp');


/* Task Module */
const { default_task } = require('./gulp-task/default');
const { build_html } = require('./gulp-task/html');
const { build_css_plugins } = require('./gulp-task/css-plugins');
const { build_css } = require('./gulp-task/css');
const { build_js } = require('./gulp-task/js');
const { build_image } = require('./gulp-task/image');
const { wf } = require('./gulp-task/watch');
const assets = require('./gulp-task/assets');
const del = require('./gulp-task/clean');


/* List of Tasks */
exports.html = series(del.clean_html, build_html);
exports.css = series(del.clean_css, build_css_plugins, build_css);
exports.js = series(del.clean_js, build_js);
exports.image = series(del.clean_image, build_image);

exports.clean = del.clean_all;
exports.clean_html = del.clean_html;
exports.clean_css = del.clean_css;
exports.clean_js = del.clean_js;
exports.clean_image = del.clean_image;

exports.watch = wf;
exports.dev = parallel(wf, browserSync.start);

exports.sync = parallel(
    assets.sync_fonts,
    assets.sync_images,
    assets.sync_plugins
);

exports.build = series(
    del.clean_all,
    build_html,
    build_css_plugins,
    build_css,
    build_js,
    build_image,
    exports.sync
);

exports.default = default_task;
