'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var commandDescriptor = {
  name: 'launch',
  description: 'tally votes and create project teams',
  usage: 'launch [options]',
  options: [{
    name: 'help',
    abbr: 'h',
    boolean: true,
    help: 'print usage information'
  }]
};
exports.default = commandDescriptor;
module.exports = exports['default'];