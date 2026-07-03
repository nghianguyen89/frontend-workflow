/* ===========================================================================
 * Task         : default_task
 * Description  : Task Gulp default
 * ===========================================================================*/

const configs = require('./_configs_');
const log = require('fancy-log');

exports.default_task = async function default_task() {
    log(
        `----------------------------------------------------
+ List variable export for configs:
    // ├── env: ${configs.env}
    // ├── production: ${configs.production}
    // ├── project: ${configs.project_name}
    // ├── cms: ${configs.project_cms}
    // ├── plugins: ${configs.plugins.active.join(', ') || '(none)'}
    // ├── static root: ${configs.static.root}
    // └── cms root: ${configs.cms.root || '(disabled)'}

+ Tasks for gulpfile.js
    ├── html (gulp html)
    ├── css (gulp css)
    ├── js (gulp js)
    ├── plugins (gulp plugins)
    ├── image (gulp image)
    ├── clean (gulp clean)
    ├── sync (gulp sync)
    ├─┬ dev (gulp dev)
    │ └─┬ <parallel>
    │   ├── watch_files
    │   └── browsersync_start
    ├─┬ build (gulp build)
    │ └─┬ <series>
    │   ├── clean
    │   └─┬ <parallel>
    │     ├── build_html
    │     ├── build_vite
    │     ├── build_image
    │     └── sync_assets
    └── default (gulp)
----------------------------------------------------`
    );
}
