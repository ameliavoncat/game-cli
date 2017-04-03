'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _loadCommand = require('./util/loadCommand');

var _loadCommand2 = _interopRequireDefault(_loadCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function filterOutInactiveCommands(commands) {
  return commands.filter(function (command) {
    return !command.commandDescriptor._inactive;
  });
}

function genCommandMap() {
  var commandConfigDir = _path2.default.resolve(__dirname, '..', 'config', 'commands');
  var commandConfigFilenames = _fs2.default.readdirSync(commandConfigDir).map(function (filename) {
    return _path2.default.resolve(commandConfigDir, filename);
  });
  var commands = commandConfigFilenames.filter(function (filename) {
    return filename.match(/\.yaml$/);
  }).map(function (filename) {
    return filename.replace(/\.yaml$/, '');
  }).map(function (commandName) {
    return (0, _loadCommand2.default)(commandName);
  });
  return filterOutInactiveCommands(commands) // ensure that it's not marked _inactive
  .reduce(function (commandMap, command) {
    commandMap[command.commandDescriptor.name] = command;
    return commandMap;
  }, {});
}

var commandMap = genCommandMap();
console.log({ commandMap: commandMap });
exports.default = commandMap;
module.exports = exports['default'];