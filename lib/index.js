'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vote = exports.cycle = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yamljs = require('yamljs');

var _yamljs2 = _interopRequireDefault(_yamljs);

var _subcli = require('subcli');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function genCommand(name) {
  var commandConfigFilename = _path2.default.resolve(__dirname, '..', 'config', 'commands', name + '.yaml');

  var _yaml$load = _yamljs2.default.load(commandConfigFilename);

  var command = _yaml$load.command;

  return {
    commandDescriptor: command,
    parse: function parse(argv) {
      return (0, _subcli.parse)(command, argv);
    },
    usage: function usage() {
      var args = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      return (0, _subcli.usage)(command, args);
    }
  };
}

var cycle = exports.cycle = genCommand('cycle');
var vote = exports.vote = genCommand('vote');