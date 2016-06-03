'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commandDescriptor = exports.usage = exports.parse = undefined;
exports.invoke = invoke;

var _loadCommand2 = require('../util/loadCommand');

var _loadCommand3 = _interopRequireDefault(_loadCommand2);

var _assertFunctions = require('../util/assertFunctions');

var _assertFunctions2 = _interopRequireDefault(_assertFunctions);

var _defaultInvokeOptions = require('../util/defaultInvokeOptions');

var _defaultInvokeOptions2 = _interopRequireDefault(_defaultInvokeOptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _loadCommand = (0, _loadCommand3.default)('profile');

var parse = _loadCommand.parse;
var usage = _loadCommand.usage;
var commandDescriptor = _loadCommand.commandDescriptor;
exports.parse = parse;
exports.usage = usage;
exports.commandDescriptor = commandDescriptor;
function invoke(argv, notify) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var opts = Object.assign({}, _defaultInvokeOptions2.default, options);
  var formatMessage = opts.formatMessage;
  var formatError = opts.formatError;
  var formatUsage = opts.formatUsage;

  (0, _assertFunctions2.default)({ notify: notify, formatMessage: formatMessage, formatError: formatError, formatUsage: formatUsage });
  var args = void 0;
  try {
    args = parse(argv);
  } catch (error) {
    return notify(formatError(error));
  }
  var usageText = usage(args);
  if (usageText) {
    notify(formatUsage(usageText));
  } else if (args._.length > 0) {
    notify(formatUsage(usage()));
  } else {
    notify(formatMessage('Loading your profile ...'));
  }
}