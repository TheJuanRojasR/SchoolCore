'use strict'

import * as tenantService from './tenant.service.js';
import { toCreateTenantResponseDTO } from './tenant.dto.js';
import { sendSuccess } from '../../utils/index.js';

export async function createTenant(req, res, next) {
    try {
        const tenantData = req.body;
        // El middleware 'authenticate' ya nos proporciona el usuario autenticado.
        const authUser = req.user;
        // Recopilamos metadatos de la petición para la auditoría.
        const auditMetadata = {
            ip: req.ip,
            userAgent: req.get('User-Agent') || 'unknown',
        };

        // Pasamos los datos al servicio.
        const createdTenant = await tenantService.createTenant(tenantData, authUser, auditMetadata);

        const tenantDTO = toCreateTenantResponseDTO(createdTenant);
        sendSuccess(res, tenantDTO, 201);
    } catch (error) {
        next(error);
    }
}