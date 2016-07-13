export const USER_ROLES = {
  PLAYER: 'player',
  MODERATOR: 'moderator',
}

export function userHasRoles(user, roles) {
  if (!Array.isArray(roles)) {
    throw new Error('roles must be an array')
  }
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return false
  }

  return roles.every(role => user.roles.indexOf(role) >= 0)
}

export function userIsPlayer(user) {
  return userHasRoles(user, [USER_ROLES.PLAYER])
}

export function userIsModerator(user) {
  return userHasRoles(user, [USER_ROLES.MODERATOR])
}
