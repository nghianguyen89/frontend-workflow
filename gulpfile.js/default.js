/* ===========================================================================
 * Task         : default_task
 * Description  : Task Gulp default
 * ===========================================================================*/

const log = require('fancy-log');

exports.default_task = async function default_task() {
    log(
        `----------------------------------------------------
+ List variable export for configs:
    // ├── configs:
    //     ├── env: ${configs.env} (${typeof configs.env})
    //     ├── production: ${configs.production} (${typeof configs.production})
    //     ├── log: (${typeof configs.log})
    //     ├── onError: (${typeof configs.onError})
    //     ├── dir: (${typeof configs.dir})

+ Tasks for gulpfile.js
    ├── html (gulp html)
    ├── css (gulp css)
    ├── js (gulp js)
    ├── image (gulp image)
    ├── clean (gulp clean)
    ├── sync (gulp sync)
    ├── copy (gulp copy)
    ├─┬ dev (gulp dev)
    │ └─┬ <parallel>
    │   ├── watch_files
    │   └── browsersync_start
    ├─┬ build (gulp build)
    │ └─┬ <series>
    │   ├── clean
    │   └─┬ <parallel>
    │     ├── build_html
    │     ├── build_css
    │     ├── build_js
    │     ├── build_image
    │     └── copy_assets
    └── default (gulp)
----------------------------------------------------`
    );
}
