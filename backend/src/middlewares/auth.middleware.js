'use strict';

import { verifyAccessToken } from "../utils/index.js";
import { UnauthorizedError } from "../utils/index.js";

export function authenticate(req, res, next) {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith('Bearer ')) {
            throw new UnauthorizedError('Token de acceso requerido');
        }

        const token = header.split(' ')[1]; // ["Bearer", "abc123"] → toma "abc123"
        const payload = verifyAccessToken(token);

        req.user = payload;
        next();
    } catch (error) {
        if (error.isOperational) return next(error);
        throw new UnauthorizedError('Token inválido o expirado');
    }
}