'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var commandDescriptor = {
  name: 'status',
  description: 'check the status of the cycle',
  usage: 'status [options]',
  options: [{
    name: 'help',
    abbr: 'h',
    boolean: true,
    help: 'print usage information'
  }]
};
exports.default = commandDescriptor;
module.exports = exports['default'];