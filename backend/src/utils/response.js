'use strict';

/**
 * Envía una respuesta JSON estandarizada para operaciones exitosas.
 *
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {*} data - El payload (datos) a enviar en la respuesta. Puede ser cualquier tipo de dato serializable a JSON.
 * @param {number} [statusCode=200] - El código de estado HTTP para la respuesta. Por defecto es 200 (OK).
 */
export function sendSuccess(res, data, statusCode = 200) {
    res.status(statusCode).json({
        success: true,
        data,
    });
}

/**
 * Envía una respuesta JSON estandarizada para endpoints que devuelven datos paginados.
 *
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {Array<*>} data - Un array de registros para la página actual.
 * @param {object} meta - Metadatos de paginación (ej. { currentPage, totalPages, totalItems }).
 */
export function sendPaginated(res, data, meta) {
    res.status(200).json({
        success: true,
        data,
        meta,
    });
}

/**
 * Envía una respuesta JSON estandarizada para errores.
 *
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {number} statusCode - El código de estado HTTP del error (ej. 400, 404, 500).
 * @param {string} code - Un código de error interno y legible para los desarrolladores (ej. 'INVALID_INPUT', 'NOT_FOUND').
 * @param {string} message - Un mensaje claro y descriptivo del error para el cliente/usuario.
 * @param {Array<*>} [details=[]] - Un array opcional con detalles adicionales sobre el error, como errores de validación de campos.
 */
export function sendError(res, statusCode, code, message, details = []) {
    res.status(statusCode).json({
        success: false,
        error: { code, message, details },
    });
}