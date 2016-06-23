'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invoke = exports.commandDescriptor = exports.usage = exports.parse = undefined;

var _loadCommand2 = require('../util/loadCommand');

var _loadCommand3 = _interopRequireDefault(_loadCommand2);

var _errorReporter = require('../util/errorReporter');

var _errorReporter2 = _interopRequireDefault(_errorReporter);

var _graphQLFetcher = require('../util/graphQLFetcher');

var _graphQLFetcher2 = _interopRequireDefault(_graphQLFetcher);

var _getServiceBaseURL = require('../util/getServiceBaseURL');

var _getServiceBaseURL2 = _interopRequireDefault(_getServiceBaseURL);

var _composeInvoke = require('../util/composeInvoke');

var _composeInvoke2 = _interopRequireDefault(_composeInvoke);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _loadCommand = (0, _loadCommand3.default)('cycle');

var parse = _loadCommand.parse;
var usage = _loadCommand.usage;
var commandDescriptor = _loadCommand.commandDescriptor;
exports.parse = parse;
exports.usage = usage;
exports.commandDescriptor = commandDescriptor;


function invokeUpdateCycleStateAPI(state, lgJWT) {
  var mutation = {
    query: 'mutation($state: String!) { updateCycleState(state: $state) { id } }',
    variables: { state: state }
  };
  return (0, _graphQLFetcher2.default)(lgJWT, (0, _getServiceBaseURL2.default)(_getServiceBaseURL.GAME))(mutation).then(function (data) {
    return data.updateCycleState;
  });
}

function invokeCreateCycleAPI(lgJWT) {
  var mutation = {
    query: 'mutation { createCycle { id cycleNumber } }'
  };
  return (0, _graphQLFetcher2.default)(lgJWT, (0, _getServiceBaseURL2.default)(_getServiceBaseURL.GAME))(mutation).then(function (data) {
    return data.createCycle;
  });
}

function handleCycleInitCommand(notify, options) {
  var lgJWT = options.lgJWT;
  var lgUser = options.lgUser;
  var formatMessage = options.formatMessage;
  var formatError = options.formatError;

  if (!lgJWT || !lgUser || lgUser.roles.indexOf('moderator') < 0) {
    return Promise.reject('You are not a moderator.');
  }

  return invokeCreateCycleAPI(lgJWT).catch(function (error) {
    _errorReporter2.default.captureException(error);
    notify(formatError(error.message || error));
  }).then(function (cycle) {
    return notify(formatMessage('Cycle #' + cycle.cycleNumber + ' Initialized. Let the voting commence...'));
  });
}

function handleUpdateCycleStateCommand(state, statusMsg, notify, options) {
  var lgJWT = options.lgJWT;
  var lgUser = options.lgUser;
  var formatMessage = options.formatMessage;
  var formatError = options.formatError;

  if (!lgJWT || !lgUser || lgUser.roles.indexOf('moderator') < 0) {
    return Promise.reject('You are not a moderator.');
  }
  notify(formatMessage(statusMsg));
  return invokeUpdateCycleStateAPI(state, lgJWT).catch(function (error) {
    _errorReporter2.default.captureException(error);
    notify(formatError(error.message || error));
  });
}

var invoke = exports.invoke = (0, _composeInvoke2.default)(parse, usage, function (args, notify, options) {
  var formatUsage = options.formatUsage;

  if (args._.length === 1) {
    var subcommandFuncs = {
      init: function init() {
        return handleCycleInitCommand(notify, options);
      },
      launch: function launch() {
        return handleUpdateCycleStateCommand('PRACTICE', '🚀  Initiating Launch... stand by.', notify, options);
      },
      reflect: function reflect() {
        return handleUpdateCycleStateCommand('REFLECTION', '🤔  Initiating Reflection... stand by.', notify, options);
      }
    };
    return subcommandFuncs[args._[0]]();
  }

  notify(formatUsage(usage()));
  return Promise.resolve();
});