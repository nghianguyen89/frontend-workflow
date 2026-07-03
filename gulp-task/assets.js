/* ===========================================================================
 * Task         : copy_assets
 * Description  : Copy/Sync all file in folder source to build
 * Note         : Using Gulp v5
 * Package      : npm install --save-dev gulp gulp-load-plugins pump gulp-file-sync
 * ===========================================================================*/

/* Common */
const configs = require('./_configs_');

/* Packages */
const $ = require('gulp-load-plugins')({
    rename: {
        'gulp-file-sync': 'fileSync'
    }
});
const log = require('fancy-log');
const fs = require('fs');
const path = require('path');

/* Task configs */
const dir_src = configs.source_dir;
const dir_public = configs.dist_dir;
const dir_assets = '/' + configs.assets_dir + '/';

const assets_src = dir_src + dir_assets;
const assets_dist = dir_public + dir_assets;

function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
}

function copyMappedFiles(sourceDir, destDir, files) {
    if (!files || files.length === 0) return;

    ensureDir(destDir);

    files.forEach((item) => {
        const source = path.resolve(sourceDir, item.from);
        const dest = path.resolve(destDir, item.to || item.from);

        if (!fs.existsSync(source)) {
            log(`Skip CMS sync, missing file: ${source}`);
            return;
        }

        ensureDir(path.dirname(dest));
        fs.copyFileSync(source, dest);
        log(`Synced CMS file: ${path.relative(process.cwd(), dest)}`);
    });
}

async function syncDirectory(source, dest, label) {
    if (!source || !dest || !fs.existsSync(source)) return;

    try {
        await $.fileSync(source, dest);
        log(`${label} are synced.`);
    } catch (err) {
        log(`Error syncing ${label}:`, err);
    }
}

/* Task */
module.exports = {

    sync_fonts: async function () {
        try {
            await $.fileSync(
                assets_src + 'fonts/',
                assets_dist + 'fonts/'
            );
            log('Fonts are synced.');
        } catch (err) {
            log('Error syncing fonts:', err);
        }
    },

    sync_images: async function () {
        try {
            await $.fileSync(
                assets_src + 'images/',
                assets_dist + 'images/'
            );
            log('Images are synced.');
        } catch (err) {
            log('Error syncing images:', err);
        }
    },

    sync_plugins: async function () {
        log('Static plugin sync is skipped. Plugin JS is bundled by Vite.');
    },

    sync_cms: async function () {
        const cms = configs.cms;

        if (!cms || !cms.enabled || !cms.root) {
            log(`CMS sync is disabled for "${configs.project_cms}".`);
            return;
        }

        const staticCssDir = path.resolve(configs.static.root, configs.static.css);
        const staticJsDir = path.resolve(configs.static.root, configs.static.js);
        const cmsRoot = path.resolve(cms.root);

        copyMappedFiles(
            staticCssDir,
            path.resolve(cmsRoot, cms.css),
            cms.files && cms.files.css
        );

        await syncDirectory(
            path.resolve(staticCssDir, 'images') + path.sep,
            cms.css ? path.resolve(cmsRoot, cms.css, 'images') + path.sep : '',
            'CMS plugin CSS assets'
        );

        copyMappedFiles(
            staticJsDir,
            path.resolve(cmsRoot, cms.js),
            cms.files && cms.files.js
        );

        if (cms.sync && cms.sync.images) {
            await syncDirectory(
                path.resolve(configs.static.root, configs.static.images) + path.sep,
                cms.images ? path.resolve(cmsRoot, cms.images) + path.sep : '',
                'CMS images'
            );
        }

        if (cms.sync && cms.sync.fonts) {
            await syncDirectory(
                path.resolve(configs.static.root, configs.static.fonts) + path.sep,
                cms.fonts ? path.resolve(cmsRoot, cms.fonts) + path.sep : '',
                'CMS fonts'
            );
        }
    },

};
