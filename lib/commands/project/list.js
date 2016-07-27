'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listProjects = listProjects;

var _sprintfJs = require('sprintf-js');

var _getServiceBaseURL = require('../../util/getServiceBaseURL');

var _getServiceBaseURL2 = _interopRequireDefault(_getServiceBaseURL);

var _errorReporter = require('../../util/errorReporter');

var _errorReporter2 = _interopRequireDefault(_errorReporter);

var _graphQLFetcher = require('../../util/graphQLFetcher');

var _graphQLFetcher2 = _interopRequireDefault(_graphQLFetcher);

var _userValidation = require('../../util/userValidation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function invokeProjectListWithReviewsAPI(lgJWT) {
  var query = {
    query: '\nquery {\n  getProjectsAndReviewResponsesForPlayer {\n    name\n    artifactURL\n    projectReviewResponses {\n      name\n      value\n    }\n  }\n}\n    '
  };
  return (0, _graphQLFetcher2.default)(lgJWT, (0, _getServiceBaseURL2.default)(_getServiceBaseURL.GAME))(query).then(function (data) {
    return data.getProjectsAndReviewResponsesForPlayer;
  });
}

function invokeProjectListSummaryAPI(lgJWT) {
  var query = {
    query: '\nquery {\n  getProjectSummaryForPlayer {\n    numActiveProjectsForCycle\n    numTotalProjectsForPlayer\n  }\n}\n    '
  };
  return (0, _graphQLFetcher2.default)(lgJWT, (0, _getServiceBaseURL2.default)(_getServiceBaseURL.GAME))(query).then(function (data) {
    return data.getProjectSummaryForPlayer;
  });
}

function formatProjectList(projects) {
  var numReviewed = projects.filter(function (proj) {
    return proj.projectReviewResponses.filter(function (resp) {
      return resp.value;
    }).length > 0;
  }).length;
  var preface = 'You have reviewed ' + numReviewed + ' / ' + projects.length + ' projects this cycle. Nice work!';
  var fmt = '%-1s  %-21s  %-3s  %-3s  %s';
  var header = (0, _sprintfJs.sprintf)(fmt, '', 'Project', 'C', 'Q', 'Artifact');
  var underlines = (0, _sprintfJs.sprintf)(fmt, '', '---------------------', '---', '---', '----------------------------------------');
  var projectLines = projects.map(function (proj) {
    var completeness = proj.projectReviewResponses.find(function (resp) {
      return resp.name === 'completeness';
    }).value;
    var quality = proj.projectReviewResponses.find(function (resp) {
      return resp.name === 'quality';
    }).value;
    var reviewed = completeness && quality ? '✓' : '-';
    return (0, _sprintfJs.sprintf)(fmt, reviewed, '#' + proj.name, completeness || '', quality || '', proj.artifactURL || '');
  });

  return preface + '\n\n' + header + '\n' + underlines + '\n' + projectLines.join('\n');
}

function listProjects(args, notify, options) {
  var lgJWT = options.lgJWT;
  var lgUser = options.lgUser;
  var formatMessage = options.formatMessage;
  var formatError = options.formatError;


  if (!lgJWT || !(0, _userValidation.userIsPlayer)(lgUser)) {
    return Promise.reject('You are not a player in the game.');
  }
  if (args._.length > 0) {
    return Promise.reject('Invalid command - wrong number of arguments (' + args._.length + ' for 0). Try --help for usage.');
  }
  if (args['in-review']) {
    return invokeProjectListWithReviewsAPI(lgJWT).then(function (projects) {
      return notify(formatMessage(formatProjectList(projects)));
    }).catch(function (err) {
      _errorReporter2.default.captureException(err);
      notify(formatError(err.message || err));
    });
  }

  return invokeProjectListSummaryAPI(lgJWT).then(function (summary) {
    var numActiveProjectsForCycle = summary.numActiveProjectsForCycle;
    var numTotalProjectsForPlayer = summary.numTotalProjectsForPlayer;

    var message = 'There are ' + numActiveProjectsForCycle + ' active projects this cycle. You have participated in ' + numTotalProjectsForPlayer + ' projects thus far.\n\nRun `/project list -r` to list projects in review.';
    notify(formatMessage(message));
  }).catch(function (err) {
    _errorReporter2.default.captureException(err);
    notify(formatError(err.message || err));
  });
}