/* ===========================================================================
 * Task         : build_css
 * Description  : Build application CSS/JS through the shared Vite pipeline.
 * ===========================================================================*/

'use strict';

// Keep one build owner: a separate Sass task can overwrite Vite-managed CSS.
exports.build_css = require('./vite').build_vite;
