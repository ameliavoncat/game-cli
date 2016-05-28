'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var commandDescriptor = {
  name: 'retro',
  description: 'initiate retrospective',
  usage: 'retro [options]',
  options: [{
    name: 'help',
    abbr: 'h',
    boolean: true,
    help: 'print usage information'
  }]
};
exports.default = commandDescriptor;
module.exports = exports['default'];