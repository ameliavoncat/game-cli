'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadCommand;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yamljs = require('yamljs');

var _yamljs2 = _interopRequireDefault(_yamljs);

var _subcli = require('subcli');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadCommandDescriptor(commandName) {
  var commandConfigFilename = _path2.default.resolve(__dirname, '..', '..', 'config', 'commands', commandName + '.yaml');

  var _yaml$load = _yamljs2.default.load(commandConfigFilename);

  var command = _yaml$load.command;

  return command;
}

function filterOutInactiveSubcommandDescriptors(commandDescriptor) {
  if (!commandDescriptor.commands) {
    return commandDescriptor;
  }
  var filteredSubcommands = filterOutInactiveCommandDescriptors(commandDescriptor.commands);
  var filteredCommandDescriptor = Object.assign({}, commandDescriptor, { commands: filteredSubcommands });
  return filteredCommandDescriptor;
}

function filterOutInactiveCommandDescriptors(commandDescriptors) {
  return commandDescriptors.map(function (commandDescriptor) {
    return filterOutInactiveSubcommandDescriptors(commandDescriptor);
  }).filter(function (commandDescriptor) {
    return !commandDescriptor._inactive;
  });
}

function loadCommand(commandName) {
  var commandDescriptor = loadCommandDescriptor(commandName);
  commandDescriptor = filterOutInactiveSubcommandDescriptors(commandDescriptor);
  return {
    commandDescriptor: commandDescriptor,
    parse: function parse(argv) {
      return (0, _subcli.parse)(commandDescriptor, argv);
    },
    usage: function usage() {
      var args = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      return (0, _subcli.usage)(commandDescriptor, args);
    }
  };
}
module.exports = exports['default'];