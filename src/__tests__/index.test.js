/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import fs from 'fs'
import path from 'path'

function uncacheIndex() {
  const modulePathname = path.resolve(__dirname, '..', 'index.js')
  delete require.cache[modulePathname]
}

describe(testContext(__filename), function () {
  describe('ignore inactive', function () {
    before(function () {
      this.cmdSourceFilePath = cmdName => path.resolve(__dirname, '..', 'commands', `${cmdName}.js`)
      this.testCommandsToWrite = {
        testcmd1: `
export function invoke(argv) {
  return false
}
export const commandDescriptor = {
  name: 'testcmd1',
  description: 'test command 1',
  _inactive: true,
}
`,

        testcmd2: `
export const invoke = 'NOT A FUNCTION'
export const commandDescriptor = {
  name: 'testcmd2',
  description: 'test command 2',
}
`,
      }

      Object.keys(this.testCommandsToWrite).forEach(cmdName => {
        fs.writeFileSync(this.cmdSourceFilePath(cmdName), this.testCommandsToWrite[cmdName])
      })

      uncacheIndex()
      this.requiredCommands = require('../index')
    })

    after(function () {
      Object.keys(this.testCommandsToWrite).forEach(cmdName => {
        fs.unlinkSync(this.cmdSourceFilePath(cmdName))
      })
    })

    it('ignores commands with _inactive attribute set to true', function () {
      expect(this.requiredCommands).to.not.have.property('testcmd1')
    })

    it('ignores commands with no invoke() function', function () {
      expect(this.requiredCommands).not.to.have.property('testcmd2')
    })
  })
})
