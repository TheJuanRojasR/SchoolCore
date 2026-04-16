'use strict';

import { ForbiddenError } from '../utils/index.js';

/**
 * @module middlewares/authorization
 * @description Middleware para verificar si un usuario tiene los permisos necesarios para realizar una acción sobre un recurso.
 */

/**
 * Crea un middleware de autorización que verifica los permisos del usuario.
 * @param {Array<string>} requiredRoles - Un array de nombres de roles requeridos. Ej: ['SUPERADMIN', 'RECTOR']
 * @returns {function} El middleware de Express.
 */
export function authorize(requiredRoles) {
    return (req, res, next) => {
        // Se asume que el middleware 'authenticate' ya se ejecutó y tenemos req.user
        const userRoles = req.user?.roles || [];

        // Comprueba si el usuario tiene al menos uno de los roles requeridos.
        const hasRequiredRole = userRoles.some(role => requiredRoles.includes(role));

        if (!hasRequiredRole) {
            throw new ForbiddenError('No tienes los permisos necesarios para acceder a este recurso.');
        }

        // Si tiene el rol, puede continuar.
        next();
    };
}
