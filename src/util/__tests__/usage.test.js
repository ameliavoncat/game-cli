/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import usage, {usageInfo, commandList, optionList, usageMessage} from '../usage'

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}

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

  describe('usageInfo', function () {
    it('returns empty string if there is no usage', function () {
      expect(usageInfo(undefined)).to.equal('')
      expect(usageInfo(null)).to.equal('')
    })

    it('concatenates the parent command if it exists', function () {
      const subcommandDescriptor = this.commandDescriptor.commands[1]
      const lines = usageInfo(subcommandDescriptor.name, this.commandDescriptor.name).split('\n').filter(line => line.length > 0)
      expect(lines[0]).to.match(/Usage:/)
      expect(lines[1]).to.match(new RegExp(`\\s+${escapeRegExp(this.commandDescriptor.name)} ${escapeRegExp(subcommandDescriptor.name)}`))
    })

    it('returns the usage info', function () {
      const lines = usageInfo(this.commandDescriptor.usage).split('\n').filter(line => line.length > 0)
      expect(lines[0]).to.match(/Usage:/)
      expect(lines[1]).to.match(new RegExp(`\\s+${escapeRegExp(this.commandDescriptor.usage)}`))
    })
  })

  describe('commandList', function () {
    it('returns empty string if there are no commands', function () {
      expect(commandList(undefined)).to.equal('')
      expect(commandList(null)).to.equal('')
      expect(commandList([])).to.equal('')
    })

    it('returns commands with their descriptions', function () {
      const lines = commandList(this.commandDescriptor.commands).split('\n').filter(line => line.length > 0)
      expect(lines[0]).to.match(/Commands:/)
      expect(lines[1]).to.match(/cmd1.+desc1/)
      expect(lines[2]).to.match(/cmd2.+desc2/)
    })
  })

  describe('optionList', function () {
    it('returns empty string if there are no options', function () {
      expect(optionList(undefined)).to.equal('')
      expect(optionList(null)).to.equal('')
      expect(optionList([])).to.equal('')
    })

    it('returns options with their descriptions', function () {
      const lines = optionList(this.commandDescriptor.options).split('\n').filter(line => line.length > 0)
      expect(lines[0]).to.match(/Options:/)
      expect(lines[1]).to.match(/--first.+-f.+first option/)
      expect(lines[2]).to.match(/--second.+-s.+second option/)
    })
  })

  describe('usageMessage', function () {
    it('returns the full usage for the command', function () {
      const lines = usageMessage(this.commandDescriptor).split('\n').filter(line => line.length > 0)
      expect(lines[0]).to.equal(`${this.commandDescriptor.name} - ${this.commandDescriptor.description}`)
      expect(lines.length).to.equal(
        1 +                                            // name + description
        2 +                                            // Usage: and usage line
        this.commandDescriptor.commands.length + 1 +   // Commands: and command list
        this.commandDescriptor.options.length + 1      // Options: and option list
      )
    })

    it('uses the command name if no usage info is provided', function () {
      const subcommandDescriptor = this.commandDescriptor.commands[1]
      const lines = usageMessage(subcommandDescriptor).split('\n').filter(line => line.length > 0)
      expect(lines[2]).to.match(new RegExp(`\\s+${escapeRegExp(subcommandDescriptor.name)}`))
    })
  })

  describe('usage', function () {
    it('returns the parent command usage when called without parsed arguments', function () {
      const usageString = usage(this.commandDescriptor)
      expect(usageString).to.match(/^cmd -/)
    })
  })

  describe('usage (passing parsed args)', function () {
    it('returns nothing if no help was requested', function () {
      const args = {_: [], help: false}
      const usageString = usage(this.commandDescriptor, args)
      expect(usageString).to.not.be.ok
    })

    it('returns the parent command usage when "--help" was requested on parent command', function () {
      const args = {_: [], help: true}
      const usageString = usage(this.commandDescriptor, args)
      expect(usageString).to.match(/^cmd -/)
    })

    it('returns the subcommand usage when "--help" was reqested on subcommand', function () {
      const args = {_: ['cmd1'], subcommand: {cmd1: {_: [], help: true}}}
      const usageString = usage(this.commandDescriptor, args)
      expect(usageString).to.match(/^cmd cmd1 -/)
    })
  })
})
