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

const delete_dir = {
    all: [dir_public + '/**/*', '!.git', '!.svn'],
    html: dir_public + '/**/*.html',
    css: dir_public + dir_assets + 'css/**/*',
    js: dir_public + dir_assets + 'js',
    image: dir_public + dir_assets + 'images/**/*',
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

    clean_html: (async () => {
        /* clean all files .html */
        await Promise.resolve(del).then((obj) => {
            obj.deleteSync(delete_dir.html);
        });
        /* clean folder empty */
        cleanEmptyFoldersRecursively(dir_public);
    }),

    clean_css: (async () => {
        await Promise.resolve(del).then((obj) => {
            obj.deleteSync(dir_src + '/styles/_plugins.scss');
            obj.deleteSync(delete_dir.css);
        });
        /* clean folder empty */
        cleanEmptyFoldersRecursively(dir_public);
    }),

    clean_js: (async () => {
        await Promise.resolve(del).then((obj) => {
            obj.deleteSync(delete_dir.js + '/bundle.js');
            obj.deleteSync(delete_dir.js + '/bundle.js.map');
            obj.deleteSync(delete_dir.js + '/bundle.min.js');
            obj.deleteSync(delete_dir.js + '/bundle.min.js.map');
        });
        /* clean folder empty */
        cleanEmptyFoldersRecursively(dir_public);
    }),

    clean_image: (async () => {
        await Promise.resolve(del).then((obj) => {
            obj.deleteSync(delete_dir.image);
        });
        /* clean folder empty */
        cleanEmptyFoldersRecursively(dir_public);
    }),

};
