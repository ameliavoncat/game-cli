"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findSubcommandDescriptor;
function findSubcommandDescriptor(commandDescriptor, subcommand) {
  var subcommandDescriptor = commandDescriptor.commands.filter(function (cmd) {
    return cmd.name === subcommand;
  })[0];
  if (!subcommandDescriptor) {
    throw new Error("FATAL: no such subcommand '" + subcommand + "'");
  }
  return subcommandDescriptor;
}
module.exports = exports["default"];