'use strict';

import { User } from './user.model.js';

export function findUserByEmail(tenantId, email) {
    return User.findOne({ tenantId, email }).select('+passwordHash').lean();
}

/**
 * Actualiza la fecha del último inicio de sesión de un usuario.
 * @param {string} userId - El ID del usuario a actualizar.
 */
export function updateUserLastLogin(userId) {
    return User.findByIdAndUpdate(userId, { lastLoginAt: new Date() });
}