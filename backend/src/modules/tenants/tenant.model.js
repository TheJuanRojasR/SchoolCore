'use strict';

import mongoose from "mongoose";
import { EDUCATION_SECTORS, CALENDARS } from '../../config/constants.js';
const { Schema } = mongoose

const tenantSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    nit: {
        number: {
            type: String,
            required: [true, 'El número del NIT es requerido.'],
            unique: true,
            trim: true,
            match: [/^\d{6,10}$/, 'El número del NIT debe ser numérico y tener entre 6 y 10 dígitos.'],
        },
        checkDigit: {
            type: String,
            required: [true, 'El dígito de verificación es requerido.'],
            trim: true,
            match: [/^\d{1}$/, 'El dígito de verificación debe ser un solo número.'],
        },
        _id: false,
    },
    daneCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        // Validación de código DANE (exactamente 12 dígitos)
        match: [/^\d{12}$/, 'El código DANE debe tener exactamente 12 caracteres numéricos.'],
    },
    daneMunicipality: {
        type: String,
        required: true,
        trim: true,
        // Validación de código DIVIPOLA (ej: 5 dígitos)
        match: [/^\d{5}$/, 'El código DIVIPOLA del municipio no tiene un formato válido.'],
    },
    educationSector: {
        type: String,
        required: true,
        enum: EDUCATION_SECTORS,
    },
    educationCalendar: {
        type: String,
        required: true,
        enum: CALENDARS,
    },
    contact: {
        address: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "El correo no es válido."] },
        logoUrl: { type: String, trim: true },
        _id: false,
    },
    rector: {
        name: { type: String, required: true, trim: true },
        resolution: { type: String, trim: true },
        _id: false,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    versionKey: false, // Deshabilita el campo __v
});

// Índices
// Los índices únicos para 'nit' y 'daneCode' ya se definen con 'unique: true' en la propiedad del esquema.
tenantSchema.index({ isActive: 1 });

export const Tenant = mongoose.model('Tenant', tenantSchema);