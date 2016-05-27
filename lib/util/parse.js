'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parse;

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(commandDescriptor, args) {
  var options = {
    string: [],
    boolean: [],
    alias: {},
    default: {},
    unknown: function unknown(opt) {
      throw new Error('Unknown option: ' + opt);
    }
  };
  commandDescriptor.options.forEach(function (opt) {
    if (opt.abbr) {
      if (!options.alias[opt.name]) {
        options.alias[opt.name] = [];
      }
      options.alias[opt.name].push(opt.abbr);
    }
    if (opt.alias) {
      if (!options.alias[opt.name]) {
        options.alias[opt.name] = [];
      }
      options.alias[opt.name] = options.alias[opt.name].concat(opt.alias);
    }
    if (opt.boolean) {
      options.boolean.push(opt.name);
    } else {
      options.string.push(opt.name);
    }
    if (opt.default) {
      options.default[opt.name] = opt.default;
    }
    // console.log({options})
  });
  return (0, _minimist2.default)(args, options);
}
module.exports = exports['default'];