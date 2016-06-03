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
    expect(getServiceBaseURL(IDM, 'development')).to.equal('http://idm.learnersguild.dev')
  })

  it('returns the .org service when in production', function () {
    expect(getServiceBaseURL(GAME, 'test')).to.equal('https://game.learnersguild.test')
  })

  it('returns the .org service when in production', function () {
    expect(getServiceBaseURL(GAME, 'production')).to.equal('https://game.learnersguild.org')
  })
})
