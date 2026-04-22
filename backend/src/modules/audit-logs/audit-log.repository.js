'use strict';

import { AuditLog } from './audit-log.model.js';

export function createAuditLog(auditLogData) {
    return AuditLog.create(auditLogData);
}