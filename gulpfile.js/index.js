'use strict';

/* gulp */
const { series, parallel } = require('gulp');

/* task module */
const { build_html } = require('./html');
const { build_css } = require('./css');
const { build_js } = require('./js');
const { build_image } = require('./image');
const { default_task } = require('./default');

const del = require('./clean');
const { sync_assets } = require('./assets-sync');
const { copy_assets } = require('./assets-copy');

const bs = require('./browser-sync');
const { wf } = require('./watch');

/* task export */
exports.html = series(del.clean_html, build_html);
exports.css = series(del.clean_css, build_css);
exports.js = series(del.clean_js, build_js);
exports.image = series(del.clean_image, build_image);

exports.clean = del.clean_all;
exports.sync = sync_assets;
exports.copy = copy_assets;

exports.watch = wf;
exports.dev = parallel(wf, bs.browsersync_start);
exports.build = series(del.clean_all, parallel(build_html, build_css, build_js, build_image));

exports.default = default_task;
