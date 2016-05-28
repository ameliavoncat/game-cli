'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cycle = require('./cycle');

Object.defineProperty(exports, 'cycle', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_cycle).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// export vote from './vote'
// export log from './log'

var commands = exports.commands = ['cycle'];