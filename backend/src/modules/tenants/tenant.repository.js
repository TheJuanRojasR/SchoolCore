'use strict';

import { Tenant } from "./tenant.model.js";

export function findTenantById(tenantId) {
    return Tenant.findById(tenantId).lean();
}

export function findTenantByNit(nitNumber) {
    return Tenant.findOne({ 'nit.number': nitNumber }).lean();
}

export function findTenantByDaneCode(daneCode) {
    return Tenant.findOne({ daneCode }).lean();
}

export function createTenant(tenantData) {
    return Tenant.create(tenantData);
}