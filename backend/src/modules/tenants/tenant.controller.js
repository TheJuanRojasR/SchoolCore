'use strict'

import * as tenantService from './tenant.service.js';
import { toCreateTenantResponseDTO } from './tenant.dto.js';
import { sendSuccess } from '../../utils/index.js';

export async function createTenant(req, res, next) {
    try {
        const tenant = req.body;

        const createdTenant = await tenantService.createTenant(tenant);
        
        const tenantDTO = toCreateTenantResponseDTO(createdTenant);
        sendSuccess(res, tenantDTO, 201);
    } catch (error) {
        next(error);
    }
}