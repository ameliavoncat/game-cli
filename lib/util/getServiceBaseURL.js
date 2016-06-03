'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getServiceBaseURL;
var IDM = exports.IDM = 'idm';
var GAME = exports.GAME = 'game';

var SERVICES = [IDM, GAME];

function getServiceBaseURL(serviceName) {
  if (SERVICES.indexOf(serviceName) < 0) {
    throw new Error('Invalid service name: ' + serviceName);
  }
  return process.env.NODE_ENV && process.env.NODE_ENV === 'development' ? 'http://' + serviceName + '.learnersguild.dev' : 'https://' + serviceName + '.learnersguild.org';
}