'use strict';

export function toCreateTenantResponseDTO(tenant) {
    if (!tenant) return null;

    return {
        id: tenant._id,
        name: tenant.name,
        nit: `${tenant.nit.number}-${tenant.nit.checkDigit}`,
        daneCode: tenant.daneCode,
        daneMunicipality: tenant.daneMunicipality,
        educationSector: tenant.educationSector,
        educationCalendar: tenant.educationCalendar,
        contact: {
            address: tenant.contact.address,
            phone: tenant.contact.phone,
            email: tenant.contact.email,
            logoUrl: tenant.contact.logoUrl,
        },
        rector: {
            name: tenant.rector.name,
            resolution: tenant.rector.resolution
        },
        isActive: tenant.isActive,
        createAt: tenant.createAt,
        updateAt: tenant.updateAt,
    }
}