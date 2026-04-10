'use strict';

/**
 * @module utils/error
 * @description Este módulo define un conjunto de clases de error personalizadas que se extienden de la clase `Error` nativa.
 * Estas clases representan errores operacionales específicos de la aplicación (por ejemplo, recurso no encontrado, acceso denegado)
 * y permiten un manejo de errores más granular y consistente en toda la API, facilitando su captura
 * en el middleware de errores.
 */

/**
 * Clase base para errores operacionales de la aplicación.
 * Los errores operacionales son errores previsibles que no indican un bug en el código,
 * como "recurso no encontrado" o "entrada inválida".
 * @extends Error
 */
export class AppError extends Error {
    /**
     * Crea una instancia de AppError.
     * @param {string} message - El mensaje de error para el cliente.
     * @param {number} statusCode - El código de estado HTTP.
     * @param {string} code - Un código de error interno para identificar el tipo de error.
     */
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
    }
}

/**
 * Representa un error 404 (Not Found).
 * Se usa cuando no se puede encontrar un recurso solicitado.
 * @extends AppError
 */
export class NotFoundError extends AppError {
    /**
     * @param {string} [message='Recurso no encontrado'] - Mensaje de error personalizado.
     */
    constructor(message = 'Recurso no encontrado') {
        super(message, 404, 'NOT_FOUND');
    }
}

/**
 * Representa un error 401 (Unauthorized).
 * Se usa cuando se requiere autenticación para acceder a un recurso y el cliente no la ha proporcionado.
 * @extends AppError
 */
export class UnauthorizedError extends AppError {
    /**
     * @param {string} [message='No autorizado'] - Mensaje de error personalizado.
     */
    constructor(message = 'No autorizado') {
        super(message, 401, 'UNAUTHORIZED');
    }
}

/**
 * Representa un error 403 (Forbidden).
 * Se usa cuando el cliente está autenticado pero no tiene permisos para realizar la acción solicitada.
 * @extends AppError
 */
export class ForbiddenError extends AppError {
    /**
     * @param {string} [message='Acceso denegado'] - Mensaje de error personalizado.
     */
    constructor(message = 'Acceso denegado') {
        super(message, 403, 'FORBIDDEN');
    }
}

/**
 * Representa un error 409 (Conflict).
 * Se usa cuando una solicitud no puede ser procesada debido a un conflicto con el estado actual del recurso.
 * (Ej: intentar crear un usuario con un email que ya existe).
 * @extends AppError
 */
export class ConflictError extends AppError {
    /**
     * @param {string} message - Mensaje de error que describe el conflicto.
     * @param {string} [code='CONFLICT'] - Código de error interno.
     */
    constructor(message, code = 'CONFLICT') {
        super(message, 409, code);
    }
}

/**
 * Representa un error 400 (Bad Request) por validación fallida.
 * Se usa cuando los datos proporcionados por el cliente no superan las reglas de validación.
 * @extends AppError
 */
export class ValidationError extends AppError {
    /**
     * @param {string} message - Mensaje general del error de validación.
     * @param {Array<*>} [details=[]] - Un array con detalles específicos sobre los campos que fallaron la validación.
     */
    constructor(message, details = []) {
        super(message, 400, 'VALIDATION_ERROR');
        this.details = details;
    }
}

/**
 * Representa un error 429 (Too Many Requests).
 * Se usa para indicar que el usuario ha enviado demasiadas solicitudes en un período de tiempo determinado (rate limiting).
 * @extends AppError
 */
export class RateLimitError extends AppError {
    /**
     * @param {string} [message='Demasiadas solicitudes. Intenta más tarde.'] - Mensaje de error personalizado.
     */
    constructor(message = 'Demasiadas solicitudes. Intenta más tarde.') {
        super(message, 429, 'RATE_LIMIT');
    }
}

/**
 * Representa un error 422 (Unprocessable Entity).
 * Se usa cuando el servidor entiende la solicitud, pero no puede procesarla debido a errores semánticos.
 * (Ej: intentar seguir una instrucción que es lógicamente incorrecta).
 * @extends AppError
 */
export class UnprocessableError extends AppError {
    /**
     * @param {string} message - Mensaje de error que describe el problema.
     * @param {string} [code='UNPROCESSABLE'] - Código de error interno.
     */
    constructor(message, code = 'UNPROCESSABLE') {
        super(message, 422, code);
    }
}