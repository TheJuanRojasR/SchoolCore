'use strict';

import { sendError } from '../utils';

/**
 * @module middlewares/error
 * @description Middleware global de manejo de errores para Express.
 * Este middleware se encarga de atrapar todos los errores que ocurren en la aplicación,
 * clasificarlos y enviar una respuesta JSON estandarizada y consistente al cliente.
 *
 * El orden de manejo es el siguiente:
 * 1. Errores operacionales personalizados (instancias de `AppError`).
 * 2. Errores de validación de Mongoose (`ValidationError`).
 * 3. Errores de clave duplicada de MongoDB (código `11000`).
 * 4. Cualquier otro error no esperado (errores 500).
 *
 * @param {Error | import('../utils').AppError} err - El objeto de error. Puede ser un error estándar o una instancia de nuestras clases de error personalizadas.
 * @param {import('express').Request} req - El objeto de solicitud de Express.
 * @param {import('express').Response} res - El objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - La función para pasar al siguiente middleware (requerida por Express para los manejadores de errores).
 */

export function errorHandler(err, req, res, next) {
    // Si es un error operacional
    if (err.isOperational) {
        return sendError(res, err.statusCode, err.code, err.message, err.details || []);
    }

    // Error de validacion de Mongoose
    if (err.name === 'ValidationError') {
        const details = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message,
        }));
        return sendError(res, 400, 'VALIDATION_ERROR', 'Datos inválidos', details);
    }

    // Error de indice duplicado de MongoDB
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `El campo ${field} ya existe`;
        return sendError(res, 409, 'DUPLICATE_KEY', message);
    }

    // Error inesperado - no se expone el stack en produccion
    console.error('ERROR NO ENCONTRADO: ', err);
    // Para errores no operacionales o inesperados, siempre se envía un 500 genérico.
    return sendError(res, 500, 'INTERNAL_ERROR', 'Error interno del servidor');
}