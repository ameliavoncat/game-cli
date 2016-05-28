/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import {parse, usage} from '../index'

describe(testContext(__filename), function () {
  describe('parse', function () {
    it('throws if an unknown option is passed', function () {
      const callParse = () => parse(['-x'])
      expect(callParse).to.throw('Unknown option: -x')
      const callParse2 = () => parse(['--unknown'])
      expect(callParse2).to.throw('Unknown option: --unknown')
    })

    it('detects if help was requested', function () {
      const args = parse(['-h', 'launch'])
      expect(args.help).to.be.ok
    })

    it('detects if launch help was requested', function () {
      const args = parse(['launch', '--help'])
      expect(args.subcommand.launch.help).to.be.ok
    })
  })

  describe('usage', function () {
    it('returns help if requested', function () {
      const args = parse(['-h', 'launch'])
      expect(usage(args)).to.match(/^cycle -/)
    })

    it('returns launch help if requested', function () {
      const args = parse(['launch', '--help'])
      expect(usage(args)).to.match(/^cycle launch -/)
    })
  })
})
