'use strict';

import Joi from 'joi';

export const loginSchema = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'El email no tiene un formato válido',
            'any.required': 'El email es requerido',
        }),
        password: Joi.string().required().messages({
            'any.required': 'La contraseña es requerida',
        }),
    }).required(),

    headers: Joi.object({
        'x-tenant-id': Joi.string().required().messages({
            'any.required': 'La cabecera x-tenant-id es requerida',
            'string.empty': 'La cabecera x-tenant-id no puede estar vacía',
        }),
    }).unknown(true), // Permite otras cabeceras que no estén definidas en el schema
});

export const refreshSchema = Joi.object({
    body: Joi.object({
        refreshToken: Joi.string().required().messages({
        'any.required': 'El refreshToken es requerido',
    }),
    }).required(),
});

export const logoutSchema = Joi.object({
    body: Joi.object({
        refreshToken: Joi.string().required().messages({
            'any.required': 'El refreshToken es requerido para cerrar la sesión.',
        }),
    }).required(),
});

export const forgotPasswordSchema = Joi.object({
    body: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'El email no tiene un formato válido.',
            'any.required': 'El email es requerido.',
        }),
    }).required(),

    headers: Joi.object({
        'x-tenant-id': Joi.string().required().messages({
            'any.required': 'La cabecera x-tenant-id es requerida.',
            'string.empty': 'La cabecera x-tenant-id no puede estar vacía.',
        }),
    }).unknown(true),
});