'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function filterOutInactiveCommands(commands) {
  return commands.filter(function (command) {
    return !command.commandDescriptor._inactive;
  });
}

function genCommandMap() {
  var commandSrcDir = _path2.default.resolve(__dirname, 'commands');
  var commandSourceFilenames = _fs2.default.readdirSync(commandSrcDir).map(function (filename) {
    return _path2.default.resolve(commandSrcDir, filename);
  });
  var commands = commandSourceFilenames.filter(function (filename) {
    var filenameToRequire = filename.match(/\.js$/) ? filename : _path2.default.join(filename, 'index.js');
    try {
      return _fs2.default.statSync(filenameToRequire, _fs2.default.R_OK).isFile();
    } catch (error) {
      return false; // file not found
    }
  }).map(function (filename) {
    return require(filename);
  });
  return filterOutInactiveCommands(commands) // ensure that it's not marked _inactive
  .filter(function (command) {
    return typeof command.invoke === 'function';
  }) // ensure that there's an implementation
  .reduce(function (commandMap, command) {
    commandMap[command.commandDescriptor.name] = command;
    return commandMap;
  }, {});
}

exports.default = genCommandMap();
module.exports = exports['default'];