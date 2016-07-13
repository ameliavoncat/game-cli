'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userHasRoles = userHasRoles;
exports.userIsPlayer = userIsPlayer;
exports.userIsModerator = userIsModerator;
var USER_ROLES = exports.USER_ROLES = {
  PLAYER: 'player',
  MODERATOR: 'moderator'
};

function userHasRoles(user, roles) {
  if (!Array.isArray(roles)) {
    throw new Error('roles must be an array');
  }
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return false;
  }

  return roles.every(function (role) {
    return user.roles.indexOf(role) >= 0;
  });
}

function userIsPlayer(user) {
  return userHasRoles(user, [USER_ROLES.PLAYER]);
}

function userIsModerator(user) {
  return userHasRoles(user, [USER_ROLES.MODERATOR]);
}