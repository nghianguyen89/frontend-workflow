'use strict';

/* Packages */
const browserSync = require('./browser-sync');
const { series, parallel } = require('gulp');


/* Task Module */
const { default_task } = require('./default');
const { build_html } = require('./html');
const { build_css } = require('./css');
const { build_js } = require('./js');
const { build_image } = require('./image');
const { wf } = require('./watch');
const assets = require('./assets');
const del = require('./clean');


/* List of Tasks */
exports.html = series(del.clean_html, build_html);
exports.css = series(del.clean_css, build_css);
exports.js = series(del.clean_js, build_js);
exports.image = series(del.clean_image, build_image);

exports.clean = del.clean_all;
exports.sync = parallel(assets.sync_fonts, assets.sync_images, assets.sync_plugins);

exports.watch = wf;
exports.dev = parallel(wf, browserSync.start);
exports.build = series(
    del.clean_all,
    build_html, build_css, build_js, build_image,
    parallel(assets.sync_fonts, assets.sync_images, assets.sync_plugins)
);

exports.default = default_task;
