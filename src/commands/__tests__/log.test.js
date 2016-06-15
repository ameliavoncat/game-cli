/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import nock from 'nock'

describe(testContext(__filename), function () {
  describe('invoke', function () {
    before(function () {
      this.invoke = require('../log').invoke
      this.notify = msg => {
        this.notifications.push(msg)
      }
      this.formatError = msg => {
        this.errors.push(msg)
      }
      this.argv = ['-rq', '1', 'some1:25', 'some2:25', 'some3:25', 'some4:25']
      this.lgJWT = 'not.a.real.token'
      this.lgPlayer = {id: 'not.a.real.id'}
    })

    beforeEach(function () {
      this.notifications = []
      this.errors = []
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

    it('notifies with a usage hint when not logging reflections', function () {
      const {lgJWT, lgPlayer} = this
      return this.invoke([], this.notify, {lgJWT, lgPlayer})
        .then(() => {
          expect(this.notifications[0]).to.match(/\-\-help/)
        })
    })

    it('prints all the queations when not given a number', function () {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {data: {
          getRetrospectiveSurvey: {
            questions: [
              {
                id: '99ede319-882f-4dc8-81e2-be43f891a111',
                subjectType: 'player',
                responseType: 'text',
                responseIntructions: 'these are the instructions',
                body: 'this is the question body',
                subject: {
                  id: '34278883-2e76-42b6-a8aa-fa74a1892f90',
                  name: 'Rosemarie Kub',
                  handle: 'mobile81'
                }
              },
              {
                id: '99ede319-882f-4dc8-81e2-be43f891a122',
                subjectType: 'player',
                responseType: 'text',
                responseIntructions: 'these are the instructions',
                body: 'this is the second question body',
                subject: {
                  id: '34278883-2e76-42b6-a8aa-fa74a1892faa',
                  name: 'Trevor Little',
                  handle: 'tlittle'
                }
              },
            ]
          }
        }})

      const {lgJWT, lgPlayer} = this
      return this.invoke(['-r'], this.notify, {lgJWT, lgPlayer}).then(() => {
        expect(this.notifications).to.match(/this is the question body/i)
        expect(this.notifications).to.match(/this is the second question body/i)
        expect(this.notifications).to.not.match(/these are the instructions/i)
      })
    })

    it('prints the question when given a number', function () {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {data: {
          getRetrospectiveSurveyQuestion: {
            id: '99ede319-882f-4dc8-81e2-be43f891a1ba',
            subjectType: 'player',
            responseType: 'text',
            responseIntructions: 'these are the instructions',
            body: 'this is the question body',
            subject: {
              id: '34278883-2e76-42b6-a8aa-fa74a1892f90',
              name: 'Rosemarie Kub',
              handle: 'mobile81'
            }
          }
        }})

      const {lgJWT, lgPlayer} = this
      return this.invoke(['-rq', '1'], this.notify, {lgJWT, lgPlayer}).then(() => {
        expect(this.notifications).to.match(/this is the question body/i)
        expect(this.notifications).to.match(/these are the instructions/i)
      })
    })

    it('notifies with a usage hint when two questions are attempted at once', function () {
      const {lgJWT, lgPlayer} = this
      this.invoke(['-r1', 'answer1', '-r2', 'answer2'], this.notify, {lgJWT, lgPlayer})
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

    it('notifies that the reflection is being logged', function () {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {data: {createdIds: ['00000000-1111-2222-3333-444444444444']}})

      const {lgJWT, lgPlayer} = this
      return this.invoke(this.argv, this.notify, {lgJWT, lgPlayer})
        .then(() => {
          expect(this.notifications[0]).to.match(/reflection\s*logged/i)
        })
    })

    it('does not notify if the API invocation succeeds', function (done) {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(200, {data: {createdIds: ['00000000-1111-2222-3333-444444444444']}})

      const {lgJWT, lgPlayer} = this
      return this.invoke(this.argv, this.notify, {lgJWT, lgPlayer})
        .then(() => {
          expect(this.notifications.length).to.equal(1)
          done()
        })
        .catch(error => done(error))
    })

    it('notifies of API invocation errors', function (done) {
      nock('http://game.learnersguild.test')
        .post('/graphql')
        .reply(500, 'Internal Server Error')

      const {lgJWT, lgPlayer, formatError} = this
      return this.invoke(['--retro', '--question', '99999999', 'answer'], this.notify, {lgJWT, lgPlayer, formatError})
        .then(() => {
          expect(this.errors.length).to.equal(1)
          done()
        })
        .catch(error => done(error))
    })
  })
})
