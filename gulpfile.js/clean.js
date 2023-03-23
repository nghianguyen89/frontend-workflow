/* ===========================================================================
 * Task         : clean
 * Description  : Clean ./build/ folder
 * Note         : Using Gulp v4
 * Package      : npm install --save-dev del
 * ===========================================================================*/

const configs = require('./configs');
const log = require('fancy-log');

const del = import('del');
const delete_dir = configs.delete_dir;

/* del all folder empty */
function cleanEmptyFoldersRecursively(folder) {
    const fs = require('fs');
    const path = require('path');

    const isDir = fs.statSync(folder).isDirectory();
    if (!isDir) return;

    let files = fs.readdirSync(folder);
    if (files.length > 0) {
        files.forEach(function (file) {
            const fullPath = path.join(folder, file);
            cleanEmptyFoldersRecursively(fullPath);
        });

        files = fs.readdirSync(folder); // re-evaluate files; after deleting subfolder, we may have parent folder empty now
    }

    if (files.length == 0) {
        log(` Removing empty folder: ${folder} `);
        fs.rmdirSync(folder);
        return;
    }
}

module.exports = {

    clean_all: async function () {
        await Promise.resolve(del).then((obj) => {
            obj.deleteSync(delete_dir.all + '/*/');
            log(`
--------------------------------------
    Cleaned everything up inside:
    => ./${delete_dir.all}/
--------------------------------------
            `);
        });
    },

    clean_html: (async () => {
        /* clean all files HTML */
        await Promise.resolve(del).then((obj) => {
            obj.deleteSync(delete_dir.html + '/**/*.html');
        });
        /* clean folder empty */
        cleanEmptyFoldersRecursively(delete_dir.html);
    }),

    clean_css: (async () => {
        await Promise.resolve(del).then((obj) => {
            obj.deleteSync(delete_dir.css + '/**/*');
        });
    }),

    clean_js: (async () => {
        await Promise.resolve(del).then((obj) => {
            obj.deleteSync(delete_dir.js + '/**/*');
        });
    }),

    clean_image: (async () => {
        await Promise.resolve(del).then((obj) => {
            obj.deleteSync(delete_dir.image + '/**/*');
        });
    }),

};
