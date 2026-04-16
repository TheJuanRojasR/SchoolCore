'use strict';

import { findTenantByNit, findTenantByDaneCode, createTenant as createTenantInDb } from './tenant.repository.js';
import { ConflictError } from '../../utils/index.js';

// -------------------------------------------------------------------------------
// 1. Funcion para crear un tenant
export async function createTenant(tenantData) {

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

    // PENDIENTE: AUDITORIA con accion CREATE

    return newTenant;
}