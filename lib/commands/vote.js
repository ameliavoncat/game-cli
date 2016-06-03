'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commandDescriptor = exports.usage = exports.parse = undefined;
exports.invoke = invoke;

var _loadCommand2 = require('../util/loadCommand');

var _loadCommand3 = _interopRequireDefault(_loadCommand2);

var _errorReporter = require('../util/errorReporter');

var _errorReporter2 = _interopRequireDefault(_errorReporter);

var _assertFunctions = require('../util/assertFunctions');

var _assertFunctions2 = _interopRequireDefault(_assertFunctions);

var _graphQLFetcher = require('../util/graphQLFetcher');

var _graphQLFetcher2 = _interopRequireDefault(_graphQLFetcher);

var _getServiceBaseURL = require('../util/getServiceBaseURL');

var _getServiceBaseURL2 = _interopRequireDefault(_getServiceBaseURL);

var _defaultInvokeOptions = require('../util/defaultInvokeOptions');

var _defaultInvokeOptions2 = _interopRequireDefault(_defaultInvokeOptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _loadCommand = (0, _loadCommand3.default)('vote');

var parse = _loadCommand.parse;
var usage = _loadCommand.usage;
var commandDescriptor = _loadCommand.commandDescriptor;
exports.parse = parse;
exports.usage = usage;
exports.commandDescriptor = commandDescriptor;


function invokeVoteAPI(lgJWT, goalDescriptors) {
  var mutation = {
    query: '\nmutation($goalDescriptors: [String]!) {\n  voteForGoals(goalDescriptors: $goalDescriptors) {\n    id\n  }\n}\n    ',
    variables: { goalDescriptors: goalDescriptors }
  };
  return (0, _graphQLFetcher2.default)(lgJWT, (0, _getServiceBaseURL2.default)(_getServiceBaseURL.GAME))(mutation).then(function (data) {
    return data.voteForGoals;
  });
}

function voteForGoals(goalDescriptors, notify, options) {
  var lgJWT = options.lgJWT;
  var lgPlayer = options.lgPlayer;
  var formatMessage = options.formatMessage;
  var formatError = options.formatError;

  try {
    if (!lgJWT || !lgPlayer || !lgPlayer.id) {
      throw new Error('You are not a player in the game.');
    }
    if (goalDescriptors.length === 1) {
      throw new Error('You must vote for exactly 2 goals.');
    }
    if (goalDescriptors.length > 2) {
      notify(formatMessage('Only 2 goals are allowed, so these were disqualified: ' + goalDescriptors.slice(2).join(', ')));
    }

    notify(formatMessage('Validating the goals you voted on: ' + goalDescriptors.join(', ')));
    return invokeVoteAPI(lgJWT, goalDescriptors).catch(function (error) {
      _errorReporter2.default.captureException(error);
      notify(formatError('API invocation failed: ' + error.message));
    });
  } catch (errorMessage) {
    notify(formatError(errorMessage.message));
  }
}

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
    notify(formatError(error));
    return;
  }
  var usageText = usage(args);
  if (usageText) {
    notify(formatUsage(usageText));
    return;
  } else if (args._.length > 0) {
    return voteForGoals(args._, notify, opts);
  }

  notify(formatMessage('Loading current cycle voting results ...'));
}