'use strict';

exports.registerGlobal = registerGlobal;

var _rendererFactory = require('./renderer-factory');

var _utilsRenderType = require('./utils/render-type');

function registerGlobal(window) {
  window.MobiledocMarkdownRenderer = _rendererFactory['default'];
}

exports.RENDER_TYPE = _utilsRenderType['default'];
exports['default'] = _rendererFactory['default'];