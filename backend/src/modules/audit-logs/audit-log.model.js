'use strict';

import mongoose from 'mongoose'
import { AUDIT_ACTIONS } from '../../config/constants.js'
const { Schema } = mongoose;

const auditLogSchema = new Schema({
    tenantId: {
        type: Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null, // Puede ser null para acciones automáticas del sistema.
        index: true,
    },
    action: {
        type: String,
        required: true,
        enum: Object.values(AUDIT_ACTIONS), // Asegura que solo se usen acciones predefinidas.
    },
    entity: {
        collection: {
            type: String,
            required: true,
            trim: true,
        },
        id: {
            type: Schema.Types.ObjectId,
            refPath: 'entity.collection', // caracteristica para referecnias dinamicas
        },
        _id: false,
    },
    changes: {
        oldValue: {
            type: Schema.Types.Mixed, // Le dice a mongoose que acepte cualquier tipo de objeto
            default: null,
        },
        newValue: {
            type: Schema.Types.Mixed,
            default: null,
        },
        _id: false
    },
    metadata: {
        ip: {
            type: String,
            required: true,
        },
        userAgent: {
            type: String, // Dice con que clase de dispositivo se genero la accion
            required: false,
        },
        _id: false
    }
}, {
    // Opciones del Schema
    timestamps: {
        createdAt: true,
        updatedAt: false,
    },
    versionKey: false,
    collection: 'audit-logs' // Nombre explícito para la colección.
});

// --- Índices Compuestos ---

// 1. Buscar el historial de un documento específico dentro de un tenant.
auditLogSchema.index({ tenantId: 1, 'entity.collection': 1, 'entity.id': 1 });

// 2. Buscar todas las acciones de un tipo específico (ej. 'LOGIN') dentro de un tenant.
auditLogSchema.index({ tenantId: 1, action: 1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);