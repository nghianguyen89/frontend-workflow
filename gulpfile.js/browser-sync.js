/* ===========================================================================
 * Task         : browser_sync
 * Description  : Live CSS Reload & Browser Syncing.
 * Note         : Using Gulp v4
 * Package      : npm install --save-dev browser-sync
 * ===========================================================================*/

const configs = require('./configs');

const browserSync = require('browser-sync').create();

module.exports = {
    browsersync_start: function () {
        browserSync.init({
            server: {
                baseDir: configs.dir.public,
            },
            port: 4200,
            browser: ["firefox"]
        });
    },
    browsersync_reload: browserSync.reload
};
