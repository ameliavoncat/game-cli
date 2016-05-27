'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usageInfo = usageInfo;
exports.commandList = commandList;
exports.optionList = optionList;
exports.default = usage;

var _cliclopts = require('cliclopts');

var _cliclopts2 = _interopRequireDefault(_cliclopts);

var _sprintfJs = require('sprintf-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function usageInfo(usage) {
  if (!usage) {
    return '';
  }

  return '\nUsage:\n    ' + usage;
}

function commandList(commands) {
  if (!commands || commands.length === 0) {
    return '';
  }

  var maxCommandWidth = commands.reduce(function (maxWidth, currCmd) {
    return currCmd.name.length > maxWidth ? currCmd.name.length : maxWidth;
  }, 0);
  var commandDescs = commands.map(function (cmd) {
    return (0, _sprintfJs.sprintf)('    %-' + maxCommandWidth + 's - %s', cmd.name, cmd.description);
  });
  return '\nCommands:\n' + commandDescs.join('\n');
}

function optionList(options) {
  if (!options || options.length === 0) {
    return '';
  }

  var cliOpts = (0, _cliclopts2.default)(options);
  return '\nOptions:\n' + cliOpts.usage();
}

function usage(commandDescriptor) {
  return commandDescriptor.name + ' - ' + commandDescriptor.description + '\n' + usageInfo(commandDescriptor.usage) + '\n' + commandList(commandDescriptor.commands) + '\n' + optionList(commandDescriptor.options);
}