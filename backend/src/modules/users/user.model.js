'use strict';

import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    tenantId: {
        type: Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true
    },
    personId: {
        type: Schema.Types.ObjectId,
        ref: 'Person',
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "El correo no es válido."],
    },
    passwordHash: {
        type: String,
        required: true,
        select: false,
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
    lastLoginAt: {
        type: Date,
        default: null
    },
    roles: [{
        roleId: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        permissions: [{
            type: String,
            required: true // Snapshot para evitar lookups en cada request
        }],
        assignedAt: {
            type: Date,
            required: true,
            default: Date.now
        },
        assignedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        _id: false,
    }]
}, {
    timestamps: true,
    versionKey: false
});

// Indices
// Indice : Es una estructura de datos especial que permite realizar consultas de manera mas rápida y eficiente.
// Analogia : Es como el indice de un libro dice exactamente en que pagina se encuentra cada tema. Si la propiedad del modelo tiene un indice sera mas rápido encontrarlo.

// 1. Dentro de cada Tenant el correo tiene que ser unico pero el mismo correo puede existir en otros tenants
userSchema.index( { tenantId: 1, email: 1 }, { unique: true } );

// 2. Una persona solo puede tener una cuenta de usuario por tenant, pero puede tener otras cuentas en distintos tenants.
userSchema.index( { tenantId: 1, personId: 1 }, { unique: true } );

export const User = mongoose.model('User', userSchema);
