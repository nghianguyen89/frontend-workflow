/* ===========================================================================
 * Task         : build_css
 * Description  : Compatibility wrapper. CSS is built by Vite.
 * ===========================================================================*/

'use strict';

const { build_vite } = require('./vite');

exports.build_css = build_vite;
