'use strict';

import { ForbiddenError } from '../utils/index.js';

/**
 * @module middlewares/authorization
 * @description Middleware para verificar si un usuario tiene los permisos necesarios para realizar una acción sobre un recurso.
 */

/**
 * Crea un middleware de autorización basado en permisos (recurso y acción).
 * @param {string} requiredResource - El nombre del recurso que se quiere proteger (ej: 'tenants', 'students').
 * @param {string} requiredAction - La acción que se quiere realizar sobre el recurso (ej: 'CREATE', 'READ').
 * @returns {function} El middleware de Express.
 */
export function authorize(requiredResource, requiredAction) {
    return (req, res, next) => {
        // Se asume que el middleware 'authenticate' ya se ejecutó y tenemos req.user con sus permisos.
        const userPermissions = req.user?.permissions || [];

        // Filtra todos los permisos que coincidan con el recurso solicitado o si tiene acceso global ('all')
        const permissionsForResource = userPermissions.filter(p => p.resource === requiredResource || p.resource === 'all');

        // Verifica si en alguno de esos permisos está la acción requerida
        const hasAction = permissionsForResource.some(p => p.actions.includes(requiredAction));

        if (!hasAction) {
            throw new ForbiddenError('No tienes permiso para realizar esta acción.');
        }

        // Si la validación es exitosa, el usuario puede continuar.
        next();
    };
}
