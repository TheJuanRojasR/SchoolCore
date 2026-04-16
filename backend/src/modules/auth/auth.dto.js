'use strict';

import { ACCESS_TOKEN_EXPIRATION_IN_SECONDS } from '../../utils/index.js';

/**
 * @module modules/auth/auth.dto
 * @description Este módulo centraliza los DTOs para las respuestas del módulo de autenticación.
 */

/**
 * Transforma los datos de tokens a un DTO de respuesta estándar.
 * @param {string} accessToken - El nuevo token de acceso.
 * @param {string} refreshToken - El nuevo token de refresco.
 * @returns {object} El objeto de respuesta con los tokens.
 */
export function toTokenResponseDTO(accessToken, refreshToken) {
    return {
        accessToken,
        refreshToken,
        expiresIn: ACCESS_TOKEN_EXPIRATION_IN_SECONDS,
    };
}

