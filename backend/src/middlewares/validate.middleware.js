'use strict';

import { ValidationError } from '../utils/index.js';

export function validate(schema) {
    return async (req, res, next) => {
        // El objeto a validar puede incluir el cuerpo, parámetros, queries y cabeceras.
        const toValidate = {
            body: req.body,
            params: req.params,
            query: req.query,
            headers: req.headers,
        };

        // Se usa `allowUnknown: true` para no fallar por campos no definidos en el schema (ej. otras cabeceras).
        const { error } = schema.validate(toValidate, { abortEarly: false, allowUnknown: true });
        if (error) {
            const details = error.details.map(d => ({
                field: d.path.join('.'),
                message: d.message,
            }));

            throw new ValidationError('Datos de entrada inválidos',details);            
        }
        next();
    };
}