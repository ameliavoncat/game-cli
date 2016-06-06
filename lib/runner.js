'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var LGJWT_FILENAME = _path2.default.join(process.env.HOME, '.lgJWT');

function getLGJWT() {
  try {
    _fs2.default.accessSync(LGJWT_FILENAME, _fs2.default.R_OK); // will throw if not readable
  } catch (error) {
    return null;
  }
  return _fs2.default.readFileSync(LGJWT_FILENAME).toString();
}

function run(commandAndArgv) {
  process.env.APP_BASEURL = 'https://game-cli.learnersguild.org';
  var lgJWT = getLGJWT();
  if (!lgJWT) {
    console.error('***Error: No lgJWT SSO token available in ' + LGJWT_FILENAME + ' -- try creating one.');
    return Promise.resolve(1);
  }

  var _commandAndArgv = _toArray(commandAndArgv);

  var commandName = _commandAndArgv[0];

  var argv = _commandAndArgv.slice(1);

  var command = require('./')[commandName];
  return command.invoke(argv, console.log, { lgJWT: lgJWT });
}

if (!module.parent) {
  /* eslint-disable xo/no-process-exit */
  var argv = process.argv.slice(2);
  run(argv).then(function (exitCode) {
    return process.exit(exitCode);
  }).catch(function (error) {
    return console.error(error.stack);
  });
}