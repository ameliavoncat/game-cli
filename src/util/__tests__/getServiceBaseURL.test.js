/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import getServiceBaseURL, {IDM, GAME} from '../getServiceBaseURL'

describe(testContext(__filename), function () {
  after(function () {
    process.env.NODE_ENV = 'test'
  })

  it('throws an error if the service name is invalid', function () {
    expect(() => getServiceBaseURL('xYz')).to.throw
  })

  it('returns the .dev service when in development', function () {
    process.env.NODE_ENV = 'development'
    expect(getServiceBaseURL(IDM)).to.equal('http://idm.learnersguild.dev')
  })

  it('returns the .org service when not in development', function () {
    process.env.NODE_ENV = 'production'
    expect(getServiceBaseURL(GAME)).to.equal('https://game.learnersguild.org')
  })
})
