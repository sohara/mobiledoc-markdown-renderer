'use strict';

var _utilsRenderType = require('../utils/render-type');

exports['default'] = {
  name: 'image-card',
  type: _utilsRenderType['default'],
  render: function render(_ref) {
    var env = _ref.env;
    var options = _ref.options;
    var payload = _ref.payload;

    if (payload.src) {
      return '![](' + payload.src + ')';
    }
  }
};