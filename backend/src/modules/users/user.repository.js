'use strict';

import { User } from './user.model.js';

/**
 * Busca un usuario por su email dentro de un tenant específico.
 * Incluye el `passwordHash` en el resultado para la verificación de la contraseña.
 * @param {string} tenantId - El ID del tenant (colegio) al que pertenece el usuario.
 * @param {string} email - El email del usuario a buscar.
 * @returns {Promise<object|null>} Una promesa que resuelve al objeto del usuario encontrado (incluyendo `passwordHash`) o `null` si no se encuentra.
 */
export function findUserByEmail(tenantId, email) {
    return User.findOne({ tenantId, email }).select('+passwordHash').lean();
}

/**
 * Actualiza la fecha del último inicio de sesión (`lastLoginAt`) de un usuario a la fecha y hora actuales.
 * @param {string} userId - El ID del usuario a actualizar.
 * @returns {Promise<object|null>} Una promesa que resuelve al documento del usuario antes de la actualización.
 */
export function updateUserLastLogin(userId) {
    return User.findByIdAndUpdate(userId, { lastLoginAt: new Date() });
}

export function findUserById(id) {
    return User.findById(id).lean();
}