/* ===========================================================================
 * Task         : browser_sync
 * Description  : Live CSS Reload & Browser Syncing.
 * Note         : Using Gulp v4
 * Package      : npm install --save-dev browser-sync
 * ===========================================================================*/

/* Common */
const configs = require('./_configs_');

/* Packages */
const { src } = require('gulp');
const server = require('browser-sync').create();


/* Task configs */
const dir_src = configs.source_dir;
const dir_public = configs.dist_dir;
const browser_configs = configs.browser_sync;
const base_dir = dir_public;
const browser = browser_configs.browsers;
const port = browser_configs.port;
const is_https = browser_configs.use_https;
const ssl_cert = browser_configs.ssl_cert;


/* Task */
module.exports = {

    start: () => {
        server.init({
            server: {
                baseDir: base_dir,
            },
            https: is_https ? ssl_cert : '',
            port: port,
            browser: browser,
        });

        // watch public folder
        return server.watch(dir_public + '/**', (event, file) => {
            // If CSS files change, don't reload browser -> inject CSS
            if (event === 'change' && file.indexOf('.css') !== -1)
                return src(dir_public + '/assets/css/**/*.css').pipe(server.stream());
            else {
                // If other files change (exclude .html files), reload browser
                if (event === 'change' && file.indexOf('.html') == -1)
                    server.reload();
            }
        });
    },

    reload: () => {
        server.reload();
    }

};
