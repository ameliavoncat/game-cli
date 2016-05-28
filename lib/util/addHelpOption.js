'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addHelpOption;
var HELP_OPTION = exports.HELP_OPTION = {
  name: 'help',
  abbr: 'h',
  boolean: true,
  help: 'print usage information',
  __DEFAULT_HELP_OPTION__: true
};

function _addHelpOption(commandDescriptor) {
  var cdWithHelp = Object.assign({}, commandDescriptor);
  if (!cdWithHelp.options) {
    cdWithHelp.options = [];
  }
  cdWithHelp.options = cdWithHelp.options.filter(function (opt) {
    return !opt.__DEFAULT_HELP_OPTION__;
  });
  cdWithHelp.options.push(HELP_OPTION);

  return cdWithHelp;
}

function addHelpOption(commandDescriptor) {
  // add help option to parent command
  var cdWithHelp = _addHelpOption(commandDescriptor);
  // recursively add help option to subcommands
  if (cdWithHelp.commands) {
    cdWithHelp.commands = cdWithHelp.commands.map(function (cmd) {
      return addHelpOption(cmd);
    });
  }

  return cdWithHelp;
}