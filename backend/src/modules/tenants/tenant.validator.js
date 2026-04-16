'use strict';

import Joi from 'joi';
import { EDUCATION_SECTORS, CALENDARS } from '../../config/constants.js';

export const createTenantSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().trim().required().messages({
            'any.required': 'El nombre del colegio es requerido.',
            'string.empty': 'El nombre del colegio no puede estar vacío.'
        }),
        nit: Joi.object({
            number: Joi.string().pattern(/^\d{6,10}$/).required().messages({
                'any.required': 'El número del NIT es requerido.',
                'string.pattern.base': 'El número del NIT debe ser numérico y tener entre 6 y 10 dígitos.'
            }),
            checkDigit: Joi.string().pattern(/^\d{1}$/).required().messages({
                'any.required': 'El dígito de verificación del NIT es requerido.',
                'string.pattern.base': 'El dígito de verificación debe ser un solo número.'
            })
        }).required().messages({
            'any.required': 'El NIT es requerido.'
        }),
        daneCode: Joi.string().pattern(/^\d{12}$/).required().messages({
            'any.required': 'El código DANE es requerido.',
            'string.pattern.base': 'El código DANE debe tener exactamente 12 caracteres numéricos.'
        }),
        daneMunicipality: Joi.string().pattern(/^\d{5}$/).required().messages({
            'any.required': 'El código DIVIPOLA del municipio es requerido.',
            'string.pattern.base': 'El código DIVIPOLA debe tener exactamente 5 caracteres numéricos.'
        }),
        educationSector: Joi.string().valid(...EDUCATION_SECTORS).required().messages({
            'any.required': 'El sector educativo es requerido.',
            'any.only': `El sector educativo debe ser uno de: ${EDUCATION_SECTORS.join(', ')}.`
        }),
        educationCalendar: Joi.string().valid(...CALENDARS).required().messages({
            'any.required': 'El calendario académico es requerido.',
            'any.only': `El calendario académico debe ser uno de: ${CALENDARS.join(', ')}.`
        }),
        contact: Joi.object({
            address: Joi.string().trim().required().messages({
                'any.required': 'La dirección de contacto es requerida.'
            }),
            phone: Joi.string().trim().required().messages({
                'any.required': 'El teléfono de contacto es requerido.'
            }),
            email: Joi.string().email().required().messages({
                'any.required': 'El email de contacto es requerido.',
                'string.email': 'El email de contacto no tiene un formato válido.'
            }),
            logoUrl: Joi.string().uri().optional().allow(null, '').messages({
                'string.uri': 'La URL del logo no es válida.'
            })
        }).required().messages({
            'any.required': 'Los datos de contacto son requeridos.'
        }),
        rector: Joi.object({
            name: Joi.string().trim().required().messages({
                'any.required': 'El nombre del rector es requerido.'
            }),
            resolution: Joi.string().trim().optional().allow(null, '')
        }).required().messages({
            'any.required': 'Los datos del rector son requeridos.'
        })
    }).required()
});