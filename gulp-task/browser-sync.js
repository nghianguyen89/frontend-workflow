/* ===========================================================================
 * Task         : browser_sync
 * Description  : Live CSS Reload & Browser Syncing.
 * Note         : Using Gulp v5
 * Package      : npm install --save-dev browser-sync
 * ===========================================================================*/

/* Common */
const configs = require('./_configs_');

/* Packages */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const server = require('browser-sync').create();

/* Task configs */
const dir_public = configs.dist_dir;
const dir_assets = '/' + configs.assets_dir;
const base_dir = dir_public;

const browser_configs = configs.browser_sync;
const browser = browser_configs.browsers;
const port = browser_configs.port;
const is_https = browser_configs.use_https;
const ssl_cert = browser_configs.ssl_cert;

const jsHashes = new Map();

function hashFile(file) {
    return crypto
        .createHash('sha256')
        .update(fs.readFileSync(file))
        .digest('hex');
}

function snapshotJsFiles(dir) {
    if (!fs.existsSync(dir)) return;

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            snapshotJsFiles(file);
        } else if (entry.isFile() && file.endsWith('.js')) {
            jsHashes.set(path.resolve(file), hashFile(file));
        }
    }
}

function reloadForChangedJs(event, file) {
    const resolvedFile = path.resolve(file);
    const previousHash = jsHashes.get(resolvedFile);

    if (event === 'unlink') {
        jsHashes.delete(resolvedFile);

        if (previousHash !== undefined) server.reload();
        return;
    }

    if (event !== 'add' && event !== 'change') return;

    const currentHash = hashFile(resolvedFile);
    jsHashes.set(resolvedFile, currentHash);

    if (previousHash !== currentHash) server.reload();
}

module.exports = {
    start: () => {
        snapshotJsFiles(path.resolve(dir_public + dir_assets + '/js'));

        server.init({
            server: {
                baseDir: base_dir,
            },
            https: is_https ? ssl_cert : false,
            port: port,
            browser: browser,
            reloadDebounce: 0,
            files: [
                dir_public + dir_assets + '/css/**/*.css',
                {
                    match: dir_public + dir_assets + '/js/**/*.js',
                    options: {
                        ignoreInitial: true,
                        awaitWriteFinish: {
                            stabilityThreshold: 100,
                            pollInterval: 20,
                        },
                    },
                    fn: reloadForChangedJs,
                },
                dir_public + dir_assets + '/images/**/*',
            ],
        });

    },

    reload: () => {
        server.reload();
    }
};
