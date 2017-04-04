'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var LGRC_FILENAME = _path2.default.join(process.env.HOME, '.lgrc');

function getUserOptions() {
  try {
    var stats = _fs2.default.statSync(LGRC_FILENAME);
    if (stats.isFile()) {
      var userOptions = JSON.parse(_fs2.default.readFileSync(LGRC_FILENAME).toString());
      return userOptions;
    }
  } catch (err) {
    return null;
  }
}

function run(commandAndArgv) {
  process.env.APP_BASE_URL = 'https://game-cli.learnersguild.org';
  var options = Object.assign({}, getUserOptions(), { maxWidth: process.stdout.columns });
  if (!options) {
    console.error('*** Error: No Learners Guild RC file found in ' + LGRC_FILENAME + ' -- try creating one.');
    return Promise.resolve(1);
  }

  var _commandAndArgv = _toArray(commandAndArgv),
      commandName = _commandAndArgv[0],
      argv = _commandAndArgv.slice(1);

  var command = require('./')[commandName];

  if (!command) {
    console.error('*** Error: No such command: ' + commandName);
    return Promise.resolve(1);
  }
  return command.invoke(argv, console.log, options);
}

if (!module.parent) {
  /* eslint-disable xo/no-process-exit */
  var argv = process.argv.slice(2);
  run(argv).then(function (exitCode) {
    return process.exit(exitCode);
  }).catch(function (err) {
    return console.error(err.stack);
  });
}