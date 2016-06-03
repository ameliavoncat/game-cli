'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = graphQLFetcher;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var APP_BASEURL = process.env.APP_BASEURL || null;

function graphQLFetcher(lgJWT, baseURL) {
  var origin = arguments.length <= 2 || arguments[2] === undefined ? APP_BASEURL : arguments[2];

  if (!lgJWT) {
    throw new Error('Need lgJWT to set "Authorization:" header');
  }
  if (!baseURL) {
    throw new Error('Need base URL of GraphQL API service');
  }
  if (!origin) {
    throw new Error('Need origin to set the "Origin:" HTTP header');
  }
  return function (graphQLParams) {
    var options = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + lgJWT,
        'Origin': origin,
        'Content-Type': 'application/json',
        'LearnersGuild-Skip-Update-User-Middleware': 1
      },
      body: JSON.stringify(graphQLParams)
    };

    return (0, _isomorphicFetch2.default)(baseURL + '/graphql', options).then(function (resp) {
      if (!resp.ok) {
        throw new Error('GraphQL ERROR: ' + resp.statusText);
      }
      return resp.json();
    }).then(function (graphQLResponse) {
      if (graphQLResponse.errors) {
        var messages = graphQLResponse.errors.map(function (e) {
          return e.message;
        });
        throw new Error(messages.join('\n'));
      }
      return graphQLResponse.data;
    });
  };
}
module.exports = exports['default'];