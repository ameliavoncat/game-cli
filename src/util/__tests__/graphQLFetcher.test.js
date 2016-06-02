/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import nock from 'nock'
import graphQLFetcher from '../graphQLFetcher'

describe(testContext(__filename), function () {
  describe('parameter checking', function () {
    it('requires an authentication token', function () {
      expect(() => graphQLFetcher(null)).to.throw(/Authorization/)
    })

    it('requires a base URL', function () {
      expect(() => graphQLFetcher('lgJWT', null)).to.throw(/base\sURL/)
    })

    it('requires an origin', function () {
      expect(() => graphQLFetcher('lgJWT', 'https://example.com', null)).to.throw(/Origin/)
    })
  })

  describe('fetching', function () {
    it('throws when the HTTP request fails', function () {
      nock('https://example1.com')
        .post('/graphql')
        .reply(500, 'Internal Server Error')

      const fetchPromise = graphQLFetcher('lgJWT', 'https://example1.com', 'https://example.com')()
      return expect(fetchPromise).to.eventually.be.rejected
    })

    it('returns the correct data when the request succeeds', function () {
      nock('https://example2.com')
        .post('/graphql')
        .reply(200, {data: 'something'})

      const fetchPromise = graphQLFetcher('lgJWT', 'https://example2.com', 'https://example.com')()
      return expect(fetchPromise).to.eventually.equal('something')
    })
  })
})
