'use strict';

/**
 * @module utils/hash
 * @description Este módulo proporciona funciones para el hashing y la comparación segura de contraseñas
 * utilizando la librería `bcryptjs`.
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;

/**
 * Hashea una contraseña de texto plano utilizando bcrypt.
 * Este proceso es unidireccional y se utiliza para almacenar contraseñas de forma segura.
 *
 * @param {string} password - La contraseña de texto plano a hashear.
 * @returns {Promise<string>} Una promesa que resuelve con el hash de la contraseña.
 */
export function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compara una contraseña de texto plano con un hash de contraseña existente.
 * Se utiliza para verificar si una contraseña ingresada por el usuario coincide con la almacenada.
 *
 * @param {string} password - La contraseña de texto plano a comparar.
 * @param {string} hash - El hash de la contraseña almacenado.
 * @returns {Promise<boolean>} Una promesa que resuelve con `true` si las contraseñas coinciden, `false` en caso contrario.
 */
export function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

/**
 * Crea un hash SHA-256 de un string.
 * Se utiliza para almacenar de forma segura los tokens de recuperación de contraseña.
 * @param {string} token - El token en texto plano.
 * @returns {string} El hash del token en formato hexadecimal.
 */
export function createHash(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}