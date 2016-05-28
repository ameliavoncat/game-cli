'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commandDescriptor = undefined;
exports.parse = parse;
exports.usage = usage;

var _util = require('../../util');

var _launch = require('./launch');

var _launch2 = _interopRequireDefault(_launch);

var _retro = require('./retro');

var _retro2 = _interopRequireDefault(_retro);

var _status = require('./status');

var _status2 = _interopRequireDefault(_status);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commandDescriptor = exports.commandDescriptor = {
  name: 'cycle',
  description: 'manage cycles',
  usage: 'cycle [options] <command>',
  commands: [_launch2.default, _retro2.default, _status2.default],
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
  commandDescriptor: commandDescriptor,
  parse: parse,
  usage: usage
};