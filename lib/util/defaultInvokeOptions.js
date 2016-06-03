"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var noop = function noop(str) {
  return str;
};
var DEFAULT_INVOKE_OPTIONS = {
  formatMessage: noop,
  formatError: noop,
  formatUsage: noop
};

exports.default = DEFAULT_INVOKE_OPTIONS;
module.exports = exports["default"];