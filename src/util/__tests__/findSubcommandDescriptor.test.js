/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import findSubcommandDescriptor from '../findSubcommandDescriptor'

describe(testContext(__filename), function () {
  before(function () {
    this.commandDescriptor = {
      name: 'cmd',
      description: 'test command',
      usage: 'cmd [options] <argument>',
      commands: [{
        name: 'cmd1',
        description: 'desc1',
        usage: 'cmd1 <arg>',
      }, {
        name: 'cmd2',
        description: 'desc2',
      }],
      options: [{
        name: 'first',
        abbr: 'f',
        boolean: true,
        help: 'first option',
      }, {
        name: 'second',
        abbr: 's',
        help: 'second option',
      }],
    }
  })

  it('throws an exception if no such subcommand exists', function () {
    const invokeFind = () => findSubcommandDescriptor(this.commandDescriptor, 'NOTVALID')
    expect(invokeFind).to.throw
  })

  it('finds the correct descriptor', function () {
    expect(findSubcommandDescriptor(this.commandDescriptor, 'cmd1')).to.deep.equal(this.commandDescriptor.commands[0])
  })
})
