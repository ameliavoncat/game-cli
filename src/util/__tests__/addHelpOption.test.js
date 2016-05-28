/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import addHelpOption from '../addHelpOption'

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

  it('adds the default help option to the parent command', function () {
    const cdWithHelp = addHelpOption(this.commandDescriptor)
    const helpOptions = cdWithHelp.options.filter(opt => opt.name === 'help')
    expect(helpOptions.length).to.equal(1)
  })

  it('adds the default help option to the subcommands', function () {
    const cdWithHelp = addHelpOption(this.commandDescriptor)
    Array.from(Array(cdWithHelp.commands.length).keys()).forEach(i => {
      const helpOptions = cdWithHelp.commands[i].options.filter(opt => opt.name === 'help')
      expect(helpOptions.length).to.equal(1)
    })
  })
})
