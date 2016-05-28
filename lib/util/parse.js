'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parse;

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function getParseOptions(commandDescriptor) {
  var options = {
    string: [],
    boolean: [],
    alias: {},
    default: {},
    stopEarly: commandDescriptor.commands && commandDescriptor.commands.length > 0,
    unknown: function unknown(opt) {
      if (opt[0] === '-') {
        throw new Error('Unknown option: ' + opt);
      }
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
  });

  return options;
}

function findSubcommandDescriptor(commandDescriptor, subcommand) {
  var subcommandDescriptor = commandDescriptor.commands.filter(function (cmd) {
    return cmd.name === subcommand;
  })[0];
  if (!subcommandDescriptor) {
    throw new Error('FATAL: no such subcommand \'' + subcommand + '\'');
  }
  return subcommandDescriptor;
}

function parse(commandDescriptor, argv) {
  var parseOptions = getParseOptions(commandDescriptor);
  var args = (0, _minimist2.default)(argv, parseOptions);

  // if we have subcommands and the subcommand was provided, we'll recurse into
  // the subcommand options and parse the subcommand options into a nested
  // object (named after the subcommand)
  if (parseOptions.stopEarly && args._.length > 0) {
    var _args$_ = _toArray(args._);

    var subcommand = _args$_[0];

    var subcommandArgv = _args$_.slice(1);

    var subcommandDescriptor = findSubcommandDescriptor(commandDescriptor, subcommand);
    var subcommandParseOptions = getParseOptions(subcommandDescriptor);
    var subcommandArgs = (0, _minimist2.default)(subcommandArgv, subcommandParseOptions);
    args = Object.assign({}, args, _defineProperty({}, subcommand, subcommandArgs));
  }

  return args;
}
module.exports = exports['default'];