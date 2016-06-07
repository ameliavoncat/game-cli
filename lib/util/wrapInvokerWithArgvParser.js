'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wrapInvokerWithArgvParser;

var _assertFunctions = require('./assertFunctions');

var _assertFunctions2 = _interopRequireDefault(_assertFunctions);

var _defaultInvokeOptions = require('./defaultInvokeOptions');

var _defaultInvokeOptions2 = _interopRequireDefault(_defaultInvokeOptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function wrapInvokerWithArgvParser(parse, usage, invokeFn) {
  return function (argv, notify) {
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
      notify(formatError(error.message || error));
      return;
    }
    var usageText = usage(args);
    if (usageText) {
      notify(formatUsage(usageText));
      return;
    }

    try {
      return invokeFn(args, notify, opts);
    } catch (error) {
      notify(formatError(error.message || error));
    }
  };
}
module.exports = exports['default'];