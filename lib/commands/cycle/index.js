'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
exports.usage = usage;

var _util = require('../../util');

var _launch = require('./launch');

var _launch2 = _interopRequireDefault(_launch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commandDescriptor = {
  name: 'cycle',
  description: 'manage cycles',
  usage: 'cycle [options] <command>',
  commands: [_launch2.default],
  options: [{
    name: 'help',
    abbr: 'h',
    boolean: true,
    help: 'print usage information'
  }]
};

function parse(argv) {
  return (0, _util.parse)(commandDescriptor, argv);
}

function usage() {
  var args = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

  return (0, _util.usage)(commandDescriptor, args);
}

exports.default = {
  parse: parse,
  usage: usage
};