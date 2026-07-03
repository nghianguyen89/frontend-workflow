/* ===========================================================================
 * Task         : clean
 * Description  : Clean ./build/ folder
 * Note         : Using Gulp v5
 * Package      : npm install --save-dev del
 * ===========================================================================*/

/* Common */
const configs = require('./_configs_');

/* Packages */
const del = import('del');
const log = require('fancy-log');


/* Task configs */
const dir_src = configs.source_dir;
const dir_public = configs.dist_dir;
const dir_assets = '/' + configs.assets_dir + '/';
const static_css = `${dir_public}/${configs.static.css}`;
const static_js = `${dir_public}/${configs.static.js}`;

const delete_dir = {
    all: [dir_public + '/**/*', '!.git', '!.svn'],
    html: dir_public + '/**/*.html',
    plugins: `${static_css}/${configs.files.css.plugins}`,
    plugin_assets: `${static_css}/images`,
    css: `${static_css}/${configs.files.css.app}`,
    css_map: `${static_css}/${configs.files.css.app}.map`,
    js: `${static_js}/${configs.files.js.app}`,
    js_map: `${static_js}/${configs.files.js.app}.map`,
    image: `${dir_public}/${configs.static.images}/**/*`,
}

/* function del all folder empty */
function cleanEmptyFoldersRecursively(folder) {
    const fs = require('fs');
    const path = require('path');

    if (!fs.existsSync(folder)) return;

    const isDir = fs.statSync(folder).isDirectory();
    if (!isDir) return;

    let files = fs.readdirSync(folder);
    if (files.length > 0) {
        files.forEach(function (file) {
            const fullPath = path.join(folder, file);
            cleanEmptyFoldersRecursively(fullPath);
        });
        // re-evaluate files; after deleting subfolder, we may have parent folder empty now
        files = fs.readdirSync(folder); 
    }

    if (files.length == 0) {
        log(` Removing empty folder: ${folder} `);
        fs.rmdirSync(folder);
        return;
    }
}


/* Task */
module.exports = {

    clean_all: async function () {
        await Promise.resolve(del).then((obj) => {
            obj.deleteSync(delete_dir.all);
            log(`
--------------------------------------
    Cleaned everything up inside:
    => ${dir_public}/
--------------------------------------
            `);
        });
    },

    clean_html: async function () {
        /* clean all files .html */
        await Promise.resolve(del).then((obj) => {
            obj.deleteSync(delete_dir.html);
        });
        /* clean folder empty */
        cleanEmptyFoldersRecursively(dir_public);
    },

    clean_plugins: async function () {
        /* clean all files inside folder plugins */
        await Promise.resolve(del).then((obj) => {
            obj.deleteSync(delete_dir.plugins);
            obj.deleteSync(delete_dir.plugin_assets);
        });
        /* clean folder empty */
        cleanEmptyFoldersRecursively(dir_public);
    },

    clean_css: async function () {
        await Promise.resolve(del).then((obj) => {
            obj.deleteSync(delete_dir.css);
            obj.deleteSync(delete_dir.css_map);
        });
        /* clean folder empty */
        cleanEmptyFoldersRecursively(dir_public);
    },

    clean_js: async function () {
        await Promise.resolve(del).then((obj) => {
            obj.deleteSync(delete_dir.js);
            obj.deleteSync(delete_dir.js_map);
        });
        /* clean folder empty */
        cleanEmptyFoldersRecursively(dir_public);
    },

    clean_vite: async function () {
        await Promise.resolve(del).then((obj) => {
            obj.deleteSync(delete_dir.css);
            obj.deleteSync(delete_dir.css_map);
            obj.deleteSync(delete_dir.js);
            obj.deleteSync(delete_dir.js_map);
        });
        cleanEmptyFoldersRecursively(dir_public);
    },

    clean_image: async function () {
        await Promise.resolve(del).then((obj) => {
            obj.deleteSync(delete_dir.image);
        });
        /* clean folder empty */
        cleanEmptyFoldersRecursively(dir_public);
    },

};
