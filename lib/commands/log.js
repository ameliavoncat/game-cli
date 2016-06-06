'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invoke = exports.commandDescriptor = exports.usage = exports.parse = undefined;

var _loadCommand2 = require('../util/loadCommand');

var _loadCommand3 = _interopRequireDefault(_loadCommand2);

var _parseArgvAndInvoke = require('../util/parseArgvAndInvoke');

var _parseArgvAndInvoke2 = _interopRequireDefault(_parseArgvAndInvoke);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _loadCommand = (0, _loadCommand3.default)('log');

var parse = _loadCommand.parse;
var usage = _loadCommand.usage;
var commandDescriptor = _loadCommand.commandDescriptor;
exports.parse = parse;
exports.usage = usage;
exports.commandDescriptor = commandDescriptor;
var invoke = exports.invoke = (0, _parseArgvAndInvoke2.default)(parse, usage, function (args, notify, options) {
  var formatError = options.formatError;
  var formatMessage = options.formatMessage;

  if (typeof args.reflection === 'string') {
    if (args.reflection === '') {
      // display retrospective survey
      notify(formatMessage('Loading retrospective survey ...'));
      return;
    } else if (args.reflection.match(/^\d+$/)) {
      // log reflection for particular question
      var questionNum = parseInt(args.reflection, 10);
      if (args._.length < 1) {
        throw new Error('You must provide a response when logging a reflection.');
      }
      notify(formatMessage('Logging your reflection for question ' + questionNum + ' ...'));
      return;
    }
  }
  notify(formatError('Invalid arguments. Try --help for usage.'));
});