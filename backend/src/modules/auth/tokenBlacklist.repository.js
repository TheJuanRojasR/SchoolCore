'use strict';

import { TokenBlacklist } from "./tokenBlacklist.model.js";

/**
 * Añade un nuevo token a la lista negra para invalidarlo.
 * @param {object} tokenData - Los datos del token a invalidar.
 */
export function add(tokenData) {
    return TokenBlacklist.create(tokenData);
}

/**
 * Busca un token en la lista negra.
 * @param {string} token - El token a buscar.
 */
export function findByToken(token) {
    return TokenBlacklist.findOne({ token }).lean();
}