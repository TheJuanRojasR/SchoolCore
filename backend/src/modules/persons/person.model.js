'use strict';

import mongoose from 'mongoose';
import { DOC_TYPES, GENDERS, ETHNICITIES, BLOOD_TYPES } from '../../config/constants.js';
const { Schema } = mongoose;

const personSchema = new Schema({
    tenantId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true,
    },
    document: {
        type: {
            type: String,
            required: [true, 'El tipo de documento es obligatorio.'],
            enum: {
                values: DOC_TYPES,
                message: 'El tipo de documento no es válido.',
            },
        },
        number: {
            type: String,
            required: [true, 'El número de documento es obligatorio.'],
            trim: true,
        },
        _id: false, // Evita que mongoose cree un _id para el subdomento
    },
    name: {
        first: {
            type: String,
            required: [true, 'El primer nombre es obligatorio.'],
            trim: true,
        },
        // Según el esquema de la DB noSQL este dato es opcional
        second: {
            type: String,
            trim: true,
        },
        firstSurname: {
            type: String,
            required: [true, 'El primer apellido es obligatorio.'],
            trim: true,
        },
        // Según el esquema de la DB noSQL este dato es opcional
        secondSurname: {
            type: String,
            trim: true,
        },
        _id: false,
    },
    birth: {
        date: {
            type: Date,
            required: [true, 'La fecha de nacimiento es obligatoria.'],
        },
        place: {
            country: {
                type: String,
                trim: true,
            },
            department: {
                type: String,
                trim: true,
            },
            municipality: {

                type: String,
                trim: true,
            },
        },
        _id: false,
    },
    gender: {
        type: String,
        required: [true, 'El género es obligatorio.'],
        enum: {
            values: GENDERS,
            message: 'El género no es válido.',
        },

    },
    bloodType: {
        type: String,
        required: [true, 'El tipo de sangre es obligatorio'],
        enum: {
            values: BLOOD_TYPES,
            message: 'El tipo de sangre no es válido.',
        },
    },
    ethnicity: {
        type: String,
        enum: {
            values: ETHNICITIES,
            message: 'El tipo de etnia no es válido.',
        },
    },
    contact: {
        phone: String,
        email: String,
        address: {
            line: String,
            municipality: String,
            department: String,
            country: String,
        },
        _id: false,
    },
},
{ timestamps: true, versionKey: false, },
);

export const Person = mongoose.model('Person', personSchema, 'persons');