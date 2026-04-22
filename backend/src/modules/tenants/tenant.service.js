'use strict';

import { findTenantByNit, findTenantByDaneCode, createTenant as createTenantInDb } from './tenant.repository.js';
import { auditLog } from '../audit-logs/audit-log.service.js';
import { AUDIT_ACTIONS } from '../../config/constants.js';
import { ConflictError } from '../../utils/index.js';

// -------------------------------------------------------------------------------
// 1. Funcion para crear un tenant
export async function createTenant(tenantData, authUser, auditMetadata) {

    // 1. Verificar si el nit existe
    const nitExists = await findTenantByNit(tenantData.nit.number);

    if (nitExists) {
        throw new ConflictError('Nit existente.')
    }

    // 2. Verificar si el codigo del Dane existe
    const daneCodeExists = await findTenantByDaneCode(tenantData.daneCode);

    if (daneCodeExists) {
        throw new ConflictError('Codigo DANE existente.')
    }

    const newTenant = await createTenantInDb(tenantData);

    // Auditoría (fire-and-forget).
    // Llamamos a nuestro nuevo servicio de log sin 'await'.
    auditLog({
        userId: authUser.userId,
        tenantId: newTenant._id,
        action: AUDIT_ACTIONS.CREATE,
        entity: {
            collection: newTenant.constructor.collection.name, // Nombre dinámico de la colección.
            id: newTenant._id,
        },
        changes: {
            newValue: newTenant.toObject(), // Guardamos el estado inicial del documento.
        },
        metadata: auditMetadata,
    });

    return newTenant;
}