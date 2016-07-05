'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invoke = exports.commandDescriptor = exports.usage = exports.parse = undefined;

var _loadCommand2 = require('../util/loadCommand');

var _loadCommand3 = _interopRequireDefault(_loadCommand2);

var _composeInvoke = require('../util/composeInvoke');

var _composeInvoke2 = _interopRequireDefault(_composeInvoke);

var _getServiceBaseURL = require('../util/getServiceBaseURL');

var _getServiceBaseURL2 = _interopRequireDefault(_getServiceBaseURL);

var _errorReporter = require('../util/errorReporter');

var _errorReporter2 = _interopRequireDefault(_errorReporter);

var _graphQLFetcher = require('../util/graphQLFetcher');

var _graphQLFetcher2 = _interopRequireDefault(_graphQLFetcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var questionNames = ['completeness', 'quality'];

var _loadCommand = (0, _loadCommand3.default)('review');

var parse = _loadCommand.parse;
var usage = _loadCommand.usage;
var commandDescriptor = _loadCommand.commandDescriptor;
exports.parse = parse;
exports.usage = usage;
exports.commandDescriptor = commandDescriptor;
var invoke = exports.invoke = (0, _composeInvoke2.default)(parse, usage, function (args, notify, options) {
  var lgJWT = options.lgJWT;
  var lgPlayer = options.lgPlayer;
  var formatError = options.formatError;
  var formatMessage = options.formatMessage;

  var notifyCallbacks = {
    msg: function msg(_msg) {
      return notify(formatMessage(_msg));
    },
    error: function error(err) {
      return notify(formatError(err));
    }
  };

  if (!lgJWT || !lgPlayer || !lgPlayer.id) {
    return Promise.reject('You are not a player in the game.');
  }
  if (isResponseCommand(args)) {
    return handleProjectReview(lgJWT, args, notifyCallbacks).catch(function (error) {
      _errorReporter2.default.captureException(error);
      notify(formatError(error.message || error));
    });
  }

  return Promise.reject('Invalid arguments. Try --help for usage.');
});

function isResponseCommand(args) {
  return Boolean(questionNames.find(function (name) {
    return args[name];
  }));
}

function handleProjectReview(lgJWT, args, _ref) {
  var msg = _ref.msg;

  var projectName = args._[0].replace('#', '');
  var responses = questionNames.map(function (questionName) {
    return {
      questionName: questionName,
      responseParams: [args[questionName]]
    };
  });

  return invokeSaveProjectReviewCLISurveyResponsesAPI(lgJWT, projectName, responses).then(function () {
    return msg(projectReviewRecordedSuccessMessage(projectName, args));
  });
}

function invokeSaveProjectReviewCLISurveyResponsesAPI(lgJWT, projectName, responses) {
  var mutation = {
    query: '\nmutation($projectName: String!, $responses: [CLINamedSurveyResponse]!) {\n  saveProjectReviewCLISurveyResponses(projectName: $projectName, responses: $responses) {\n    createdIds\n  }\n}\n    ',
    variables: { projectName: projectName, responses: responses }
  };
  return (0, _graphQLFetcher2.default)(lgJWT, (0, _getServiceBaseURL2.default)(_getServiceBaseURL.GAME))(mutation).then(function (data) {
    return data.saveProjectReviewCLISurveyResponses;
  });
}

function projectReviewRecordedSuccessMessage(projectName, args) {
  if (args.completeness && args.quality) {
    return 'Completeness and quality scores captured for #' + projectName + '!';
  }

  if (args.completeness) {
    return 'Completeness score captured for #' + projectName + '!';
  }

  if (args.quality) {
    return 'Quality score captured for #' + projectName + '!';
  }
}