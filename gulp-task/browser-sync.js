/* ===========================================================================
 * Task         : browser_sync
 * Description  : Live CSS Reload & Browser Syncing.
 * Note         : Using Gulp v5
 * Package      : npm install --save-dev browser-sync
 * ===========================================================================*/

/* Common */
const configs = require('./_configs_');

/* Packages */
const { src } = require('gulp');
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

module.exports = {
    start: () => {
        server.init({
            server: {
                baseDir: base_dir,
            },
            https: is_https ? ssl_cert : false,
            port: port,
            browser: browser,
        });

        // Watch public folder
        return server.watch(dir_public + '/**', (event, file) => {
            if (event === 'change') {
                if (file.includes('.css')) {
                    // Inject CSS changes without reload
                    return src(dir_public + dir_assets + '/css/**/*.css').pipe(server.stream());
                } else if (!file.includes('.html')) {
                    // Reload for non-HTML file changes
                    server.reload();
                }
            }
        });
    },

    reload: () => {
        server.reload();
    }
};