/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import parse from '../parse'

describe(testContext(__filename), function () {
  before(function () {
    this.commandDescriptor = {
      name: 'turn',
      description: 'power something on or off',
      usage: 'turn [options] <command>',
      commands: [{
        name: 'on',
        description: 'power on an item',
        usage: 'on <item>'
      }, {
        name: 'off',
        description: 'power off an item',
        usage: 'off <item>',
        options: [{
          name: 'unplug',
          alias: ['pullplug'],
          boolean: true,
          help: 'unplug the item after turning it off'
        }]
      }],
      options: [{
        name: 'help',
        abbr: 'h',
        boolean: true,
        help: 'get help for this command',
      }, {
        name: 'when',
        abbr: 'w',
        alias: ['delay'],
        help: 'when to turn something on or off (e.g., 5min)',
      }],
    }
  })

  describe('parse', function () {
    it('throws if an unknown option is passed', function () {
      const callParse = () => parse(this.commandDescriptor, ['-x'])
      expect(callParse).to.throw('Unknown option: -x')
    })

    it('parses abbreviated options correctly', function () {
      const args = parse(this.commandDescriptor, ['-h', '-w', '5min'])
      expect(args.help).to.be.ok
      expect(args.when).to.equal('5min')
    })

    it('parses alias options correctly', function () {
      const args = parse(this.commandDescriptor, ['--delay=5min'])
      expect(args.when).to.equal('5min')
    })
  })
})
