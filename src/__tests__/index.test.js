/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import {default as commands} from '../index'

describe(testContext(__filename), function () {
  describe('imports and exports', function () {
    it('usage(), parse(), and commandDescriptor exist for every command', function () {
      Object.keys(commands).forEach(cmdName => {
        const command = commands[cmdName]
        expect(command.commandDescriptor).to.have.property('name')
        expect(typeof command.usage).to.equal('function')
        expect(typeof command.parse).to.equal('function')
      })
    })
  })
})
