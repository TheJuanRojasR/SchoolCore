'use strict';

import mongoose from 'mongoose';
import { SYSTEM_ROLES, PERMISSION_ACTIONS } from '../../config/constants.js';

const { Schema } = mongoose;

const permissionSchema = new Schema({
    resource: {
        type: String,
        required: [true, 'El recurso del permiso es requerido.'],
        trim: true,
    },
    actions: [{
        type: String,
        required: true,
        enum: {
            values: PERMISSION_ACTIONS,
            message: 'La acción {VALUE} no es una acción permitida.'
        }
    }],
    _id: false
});

const roleSchema = new Schema({
    tenantId: {
        type: Schema.Types.ObjectId,
        ref: 'Tenant',
        default: null, // null para roles globales del sistema
    },
    name: {
        type: String,
        required: [true, 'El nombre del rol es requerido.'],
        trim: true,
        enum: {
            values: SYSTEM_ROLES,
            message: 'El rol {VALUE} no es un rol válido del sistema.'
        }
    },
    description: {
        type: String,
        trim: true,
    },
    isSystem: {
        type: Boolean,
        required: true,
        default: false,
    },
    permissions: {
        type: [permissionSchema],
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false,
});

roleSchema.index({ tenantId: 1, name: 1 }, { unique: true });

export const Role = mongoose.model('Role', roleSchema);
