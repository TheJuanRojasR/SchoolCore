'use strict';

import mongoose from 'mongoose';
import { TOKEN_INVALIDATION_REASONS } from '../../config/constants.js';
const { Schema } = mongoose;

const tokenBlacklistSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true,    // Idempotencia: no permite duplicar el mismo token invalidado
        index: true      // Búsqueda rápida durante el proceso de Refresh
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // BUENA PRÁCTICA: Índice TTL. MongoDB eliminará automáticamente este documento cuando llegue la fecha de expiresAt (la misma fecha de expiración del JWT).
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tenantId: {
        type: Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true // Aislamiento multitenant
    },
    metadata: {
        ip: { type: String, default: 'unknown' },
        userAgent: { type: String, default: 'unknown' },
        reason: { type: String, enum: TOKEN_INVALIDATION_REASONS, default: 'LOGOUT' }
    }
}, {
    timestamps: true,
    versionKey: false
});

// Índice compuesto para auditoría rápida por tenant
tokenBlacklistSchema.index({ tenantId: 1, userId: 1 });

export const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);