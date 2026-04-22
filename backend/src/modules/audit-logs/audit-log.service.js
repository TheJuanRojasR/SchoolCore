'use strict';

import { createAuditLog } from './audit-log.repository.js';

/**
 * Registra un evento de auditoría de forma asíncrona (fire-and-forget).
 * No bloquea el hilo de ejecución principal para responder más rápido al cliente.
 *
 * @param {object} logData - Los datos para el registro de auditoría, que deben coincidir con `audit-log.model.js`.
 * @returns {void}
 */
export function auditLog(logData) {
    // No se utiliza await para que no se le demore la respuesta al usuario. el catch recoge algun error que pueda haber al escribir en la DB
    createAuditLog(logData).catch(error => {
        console.error('Error al guardar el log de auditoría:', error); // En produccion utilizar (Winston o Pino)
    });
}
