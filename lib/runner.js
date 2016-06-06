'use strict';

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function run(commandAndArgv) {
  var _commandAndArgv = _toArray(commandAndArgv);

  var commandName = _commandAndArgv[0];

  var argv = _commandAndArgv.slice(1);

  var command = require('./')[commandName];
  command.invoke(argv, console.log);
}

if (!module.parent) {
  var argv = process.argv.slice(2);
  run(argv);
}