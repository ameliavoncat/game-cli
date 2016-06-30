/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */

import nock from 'nock'

describe(testContext(__filename), function () {
  describe('invoke', function () {
    before(function () {
      this.invoke = require('../review').invoke
      this.notify = msg => {
        this.notifications.push(msg)
      }
      this.formatError = msg => `__FMT: ${msg}`
      this.argv = ['#some-project', '--completeness', '89', '--quality', '93']
      this.lgJWT = 'not.a.real.token'
      this.lgPlayer = {id: 'not.a.real.id'}
    })

    beforeEach(function () {
      this.notifications = []
    })

    afterEach(function () {
      nock.cleanAll()
    })

    it('notifies with the usage message when requested', function () {
      const {lgJWT, lgPlayer} = this
      return this.invoke(['-h'], this.notify, {lgJWT, lgPlayer})
        .then(() => {
          expect(this.notifications[0]).to.match(/Usage:/)
        })
    })

    it('notifies with a usage hint when called with no args', function () {
      const {lgJWT, lgPlayer} = this
      return this.invoke([], this.notify, {lgJWT, lgPlayer})
        .then(() => {
          expect(this.notifications[0]).to.match(/\-\-help/)
        })
    })

    it('notifies with an error message when invoked by a non-player', function () {
      const {lgJWT} = this
      return Promise.all([
        this.invoke(this.argv, this.notify, {lgJWT, lgPlayer: null})
          .then(() => {
            expect(this.notifications[0]).to.match(/not a player/)
          }),
        this.invoke(this.argv, this.notify, {lgJWT, lgPlayer: {object: 'without id attribute'}})
          .then(() => {
            expect(this.notifications[1]).to.match(/not a player/)
          })
      ])
    })

    it('notifies that completeness and quality have been recorded', function () {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {data: {saveProjectReviewCLISurveyResponses: {createdIds: [
          '00000000-1111-2222-3333-444444444444',
          '55555555-6666-7777-8888-999999999999',
        ]}}})

      const {lgJWT, lgPlayer} = this
      return this.invoke(this.argv, this.notify, {lgJWT, lgPlayer})
        .then(() => {
          expect(this.notifications[0]).to.match(/completeness and quality scores captured/i)
        })
    })

    const scoreNames = ['quality', 'completeness']
    scoreNames.forEach(function (scoreName) {
      it(`notifies that ${scoreName} has been recorded`, function () {
        nock('http://game.learnersguild.test')
          .post('/graphql')
          .reply(200, {data: {createdIds: [
            '00000000-1111-2222-3333-444444444444',
          ]}})

        const {lgJWT, lgPlayer} = this
        return this.invoke(['#some-project', `--${scoreName}`, '89'], this.notify, {lgJWT, lgPlayer})
          .then(() => {
            expect(this.notifications[0]).to.match(new RegExp(`${scoreName} score captured`, 'i'))
          })
      })
    })

    it('notifies of API invocation errors', function (done) {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(500, 'Internal Server Error')

      const {lgJWT, lgPlayer, formatError} = this
      return this.invoke(this.argv, this.notify, {lgJWT, lgPlayer, formatError})
        .then(() => {
          expect(this.notifications[0]).to.equal('__FMT: Internal Server Error')
          done()
        })
        .catch(error => done(error))
    })

    it('notifies of GraphQL invocation errors', function (done) {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {errors: [{message: 'GraphQL Error'}]})

      const {lgJWT, lgPlayer, formatError} = this
      this.invoke(this.argv, this.notify, {lgJWT, lgPlayer, formatError})
        .then(() => {
          expect(this.notifications[0]).to.equal('__FMT: GraphQL Error')
          done()
        })
        .catch(error => done(error))
    })
  })
})
