'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invoke = exports.commandDescriptor = exports.usage = exports.parse = undefined;

var _errorReporter = require('../util/errorReporter');

var _errorReporter2 = _interopRequireDefault(_errorReporter);

var _graphQLFetcher = require('../util/graphQLFetcher');

var _graphQLFetcher2 = _interopRequireDefault(_graphQLFetcher);

var _getServiceBaseURL = require('../util/getServiceBaseURL');

var _getServiceBaseURL2 = _interopRequireDefault(_getServiceBaseURL);

var _loadCommand2 = require('../util/loadCommand');

var _loadCommand3 = _interopRequireDefault(_loadCommand2);

var _composeInvoke = require('../util/composeInvoke');

var _composeInvoke2 = _interopRequireDefault(_composeInvoke);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _loadCommand = (0, _loadCommand3.default)('log');

var parse = _loadCommand.parse;
var usage = _loadCommand.usage;
var commandDescriptor = _loadCommand.commandDescriptor;
exports.parse = parse;
exports.usage = usage;
exports.commandDescriptor = commandDescriptor;


function invokeResponseAPI(lgJWT, lgPlayer, questionNumber, responseParams) {
  var mutation = {
    query: '\nmutation($response: CLISurveyResponse!) {\n  saveRetrospectiveCLISurveyResponse(response: $response) {\n    createdIds\n  }\n}\n    ',
    variables: { response: { questionNumber: questionNumber, responseParams: responseParams } }
  };
  return (0, _graphQLFetcher2.default)(lgJWT, (0, _getServiceBaseURL2.default)(_getServiceBaseURL.GAME))(mutation).then(function (data) {
    return data.saveRetrospectiveCLISurveyResponse;
  });
}

var invoke = exports.invoke = (0, _composeInvoke2.default)(parse, usage, function (args, notify, options) {
  var lgJWT = options.lgJWT;
  var lgPlayer = options.lgPlayer;
  var formatError = options.formatError;
  var formatMessage = options.formatMessage;

  if (!lgJWT || !lgPlayer || !lgPlayer.id) {
    return Promise.reject('You are not a player in the game.');
  }
  if (typeof args.reflection === 'string') {
    if (args.reflection === '') {
      // display retrospective survey
      // see: https://github.com/LearnersGuild/game-cli/issues/13
      // notify(formatMessage('Loading retrospective survey ...'))
      return Promise.reject('Unable to load retrospective survey (NOT YET IMPLEMENTED).');
    }
    if (args.reflection.match(/^\d+$/)) {
      var questionNumber = parseInt(args.reflection, 10);
      if (args._.length === 0) {
        // display retrospective question
        // see: https://github.com/LearnersGuild/game-cli/issues/14
        // notify(formatMessage(`Loading retrospective question ${questionNumber} ...`))
        return Promise.reject('Unable to load retrospective question ' + questionNumber + ' (NOT YET IMPLEMENTED).');
      }
      // log reflection for particular question
      notify(formatMessage('Logging your reflection for question ' + questionNumber + ' ...'));
      return invokeResponseAPI(lgJWT, questionNumber, args._).catch(function (error) {
        _errorReporter2.default.captureException(error);
        notify(formatError('API invocation failed: ' + (error.message || error)));
      });
    }
  }
  return Promise.reject('Invalid arguments. Try --help for usage.');
});