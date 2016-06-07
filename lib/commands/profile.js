'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invoke = exports.commandDescriptor = exports.usage = exports.parse = undefined;

var _loadCommand2 = require('../util/loadCommand');

var _loadCommand3 = _interopRequireDefault(_loadCommand2);

var _wrapInvokerWithArgvParser = require('../util/wrapInvokerWithArgvParser');

var _wrapInvokerWithArgvParser2 = _interopRequireDefault(_wrapInvokerWithArgvParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _loadCommand = (0, _loadCommand3.default)('profile');

var parse = _loadCommand.parse;
var usage = _loadCommand.usage;
var commandDescriptor = _loadCommand.commandDescriptor;
exports.parse = parse;
exports.usage = usage;
exports.commandDescriptor = commandDescriptor;
var invoke = exports.invoke = (0, _wrapInvokerWithArgvParser2.default)(parse, usage, function (args, notify, options) {
  var formatMessage = options.formatMessage;
  var formatUsage = options.formatUsage;

  if (args._.length > 0) {
    notify(formatUsage(usage()));
    return;
  }

  notify(formatMessage('Loading your profile ...'));
});