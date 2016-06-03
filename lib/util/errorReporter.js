'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _raven = require('raven');

var _raven2 = _interopRequireDefault(_raven);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_raven2.default.patchGlobal(process.env.SENTRY_SERVER_DSN);

var errorReporter = new _raven2.default.Client(process.env.SENTRY_SERVER_DSN);

exports.default = errorReporter;
module.exports = exports['default'];