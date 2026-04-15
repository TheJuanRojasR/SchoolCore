'use strict';

/**
 * @module utils/jwt
 * @description Este módulo proporciona funciones para la creación y verificación de JSON Web Tokens (JWT).
 * Se encarga de generar tokens de acceso y de refresco, así como de validar su autenticidad e integridad.
 */

import jwt from 'jsonwebtoken';
import { AppError } from './index.js';

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// Es crucial que las claves secretas estén definidas para que la aplicación pueda funcionar de forma segura.
// Si no lo están, se lanza un error de configuración del servidor al iniciar la aplicación.
if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new AppError('JWT_SECRET y REFRESH_SECRET deben estar definidas.', 500, 'SERVER_CONFIGURATION_ERROR');
}

export const ACCESS_TOKEN_EXPIRATION_IN_SECONDS = 8 * 60 * 60;

// Tiempos de expiración para los tokens. Se pueden configurar desde las variables de entorno.
const ACCESS_EXP = process.env.JWT_EXPIRES_IN || ACCESS_TOKEN_EXPIRATION_IN_SECONDS;
const REFRESH_EXP = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Algoritmo de firma. Se define como una constante para asegurar consistencia y seguridad.
const ALGORITHM = 'HS256';

/**
 * Firma un nuevo token de acceso.
 * Este token es de corta duración y se utiliza para autenticar al usuario en cada solicitud a rutas protegidas.
 *
 * @param {object} payload - El contenido (datos) que se incluirá en el token. Generalmente, el ID del usuario y sus roles.
 * @returns {string} El token de acceso firmado en formato JWT.
 */
export function singAccessToken(payload) {
    return jwt.sign(payload, ACCESS_SECRET, {
        // Se coloca de forma explicita para evitar ataques que fuercen el uso de otros algoritmos o none
        algorithm: ALGORITHM,
        expiresIn: ACCESS_EXP,
    });
}

/**
 * Firma un nuevo token de refresco.
 * Este token es de larga duración y se utiliza para obtener un nuevo token de acceso cuando el actual ha expirado.
 *
 * @param {object} payload - El contenido (datos) que se incluirá en el token. Usualmente, solo el ID del usuario.
 * @returns {string} El token de refresco firmado en formato JWT.
 */
export function singRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_SECRET, {
        algorithm: ALGORITHM,
        expiresIn: REFRESH_EXP,
    })
}

/**
 * Verifica la validez de un token de acceso.
 * Comprueba la firma y la fecha de expiración del token.
 *
 * @param {string} token - El token de acceso en formato JWT a verificar.
 * @returns {object | string} El payload decodificado del token si la verificación es exitosa.
 * @throws {JsonWebTokenError | TokenExpiredError} Lanza un error si el token es inválido, ha sido manipulado o ha expirado.
 */
export function verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_SECRET, {
        // Se dice explicitamente que solo acepte tokens firmados por los algoritmos en el array
        algorithms: [ALGORITHM],
    });
}

/**
 * Verifica la validez de un token de refresco.
 * Comprueba la firma y la fecha de expiración del token.
 *
 * @param {string} token - El token de refresco en formato JWT a verificar.
 * @returns {object | string} El payload decodificado del token si la verificación es exitosa.
 * @throws {JsonWebTokenError | TokenExpiredError} Lanza un error si el token es inválido, ha sido manipulado o ha expirado.
 */
export function verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_SECRET, {
        algorithms: [ALGORITHM],
    });
}