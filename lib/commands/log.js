'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invoke = exports.commandDescriptor = exports.usage = exports.parse = undefined;

var _graphQLFetcher = require('../util/graphQLFetcher');

var _graphQLFetcher2 = _interopRequireDefault(_graphQLFetcher);

var _getServiceBaseURL = require('../util/getServiceBaseURL');

var _getServiceBaseURL2 = _interopRequireDefault(_getServiceBaseURL);

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


function invokeResponseAPI(lgJWT, questionNumber, responseParams) {
  var mutation = {
    query: '\nmutation($response: CLISurveyResponse!) {\n  saveRetrospectiveCLISurveyResponse(response: $response) {\n    createdIds\n  }\n}\n    ',
    variables: { response: { questionNumber: questionNumber, responseParams: responseParams } }
  };
  return (0, _graphQLFetcher2.default)(lgJWT, (0, _getServiceBaseURL2.default)(_getServiceBaseURL.GAME))(mutation).then(function (data) {
    return data.saveRetrospectiveCLISurveyResponse;
  });
}

var invoke = exports.invoke = (0, _parseArgvAndInvoke2.default)(parse, usage, function (args, notify, options) {
  var lgJWT = options.lgJWT;
  var formatError = options.formatError;
  var formatMessage = options.formatMessage;

  if (typeof args.reflection === 'string') {
    if (args.reflection === '') {
      // display retrospective survey
      // see: https://github.com/LearnersGuild/game-cli/issues/13
      // notify(formatMessage('Loading retrospective survey ...'))
      notify(formatError('Unable to load retrospective survey (NOT YET IMPLEMENTED).'));
      return;
    } else if (args.reflection.match(/^\d+$/)) {
      var questionNumber = parseInt(args.reflection, 10);
      if (args._.length === 0) {
        // display retrospective question
        // see: https://github.com/LearnersGuild/game-cli/issues/14
        // notify(formatMessage(`Loading retrospective question ${questionNumber} ...`))
        notify(formatError('Unable to load retrospective question ' + questionNumber + ' (NOT YET IMPLEMENTED).'));
        return;
      }
      // log reflection for particular question
      notify(formatMessage('Logging your reflection for question ' + questionNumber + ' ...'));
      return invokeResponseAPI(lgJWT, questionNumber, args._);
    }
  }
  notify(formatError('Invalid arguments. Try --help for usage.'));
});