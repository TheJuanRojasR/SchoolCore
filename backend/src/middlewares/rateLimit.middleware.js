'use strict';

import rateLimit from 'express-rate-limit';
import { RateLimitError } from '../utils/index.js';

/**
 * Middleware para limitar la cantidad de solicitudes a endpoints sensibles.
 * Previene ataques de fuerza bruta o spam.
 */
export const forgotPasswordLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hora
	max: 3, // Límite de 3 solicitudes por IP por ventana de tiempo
	handler: (req, res, next) => {
		// Lanza un error personalizado que será capturado por el errorHandler global.
		next(new RateLimitError('Has excedido el límite de solicitudes para recuperar contraseña. Intenta de nuevo en una hora.'));
	},
	standardHeaders: true, // Devuelve la información del límite en las cabeceras `RateLimit-*`
	legacyHeaders: false, // Deshabilita las cabeceras `X-RateLimit-*`
});
