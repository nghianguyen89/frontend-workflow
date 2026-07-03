/* ===========================================================================
 * Task         : build_js
 * Description  : Compatibility wrapper. JS is built by Vite.
 * ===========================================================================*/

'use strict';

const { build_vite } = require('./vite');

exports.build_js = build_vite;
