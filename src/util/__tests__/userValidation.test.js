/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */

import {
  userHasRoles,
  userIsPlayer,
  userIsModerator,
} from '../userValidation'

describe(testContext(__filename), function () {
  describe('userHasRoles', function () {
    it('throws an error if the passed-in roles to check is not an array', function () {
      expect(() => userHasRoles({}, '')).to.throw(/roles must be an array/)
      expect(() => userHasRoles(null, {})).to.throw(/roles must be an array/)
    })

    it('returns false if the user is null', function () {
      expect(userHasRoles(null, ['player'])).to.equal(false)
    })
    it('returns false if the user has no `roles` property', function () {
      const user = {id: 'not.a.real.id', handle: 'abc123'}
      expect(userHasRoles(user, ['player'])).to.equal(false)
    })

    it('returns false if the `roles` property is not an array', function () {
      const user = {id: 'not.a.real.id', handle: 'abc123', roles: 'player'}
      expect(userHasRoles(user, ['player'])).to.equal(false)
    })

    it('returns false if the user does not have the given roles', function () {
      const user = {id: 'not.a.real.id', handle: 'abc123', roles: ['backoffice']}
      expect(userHasRoles(user, ['player'])).to.equal(false)
    })

    it('returns true if the user has the given roles', function () {
      const user = {id: 'not.a.real.id', handle: 'abc123', roles: ['backoffice', 'player', 'moderator']}
      expect(userHasRoles(user, ['backoffice', 'moderator'])).to.equal(true)
    })
  })

  describe('userIsPlayer', function () {
    it('returns false if the user does not have the `player` role', function () {
      expect(userIsPlayer(null)).to.equal(false)
      expect(userIsPlayer({})).to.equal(false)
      expect(userIsPlayer({id: 'not.a.real.id', handle: 'abc123'})).to.equal(false)
      expect(userIsPlayer({id: 'not.a.real.id', handle: 'abc123', roles: 'player'})).to.equal(false)
      expect(userIsPlayer({id: 'not.a.real.id', handle: 'abc123', roles: ['moderator']})).to.equal(false)
    })

    it('returns true if the user has the `player` role', function () {
      expect(userIsPlayer({id: 'not.a.real.id', handle: 'abc123', roles: ['player']})).to.equal(true)
    })
  })

  describe('userIsModerator', function () {
    it('returns false if the user does not have the `moderator` role', function () {
      expect(userIsModerator(null)).to.equal(false)
      expect(userIsModerator({})).to.equal(false)
      expect(userIsModerator({id: 'not.a.real.id', handle: 'abc123'})).to.equal(false)
      expect(userIsModerator({id: 'not.a.real.id', handle: 'abc123', roles: 'moderator'})).to.equal(false)
      expect(userIsModerator({id: 'not.a.real.id', handle: 'abc123', roles: ['player']})).to.equal(false)
    })

    it('returns true if the user has the `moderator` role', function () {
      expect(userIsModerator({id: 'not.a.real.id', handle: 'abc123', roles: ['moderator']})).to.equal(true)
    })
  })
})
