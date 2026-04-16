'use strict';

import * as authService from './auth.service.js';
import { toLoginUserDTO, toUserProfileDTO } from '../users/user.dto.js';
import { toTokenResponseDTO } from './auth.dto.js';
import { sendSuccess } from '../../utils/index.js';

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const tenantId = req.headers['x-tenant-id'];

        const result = await authService.login(tenantId, email, password);

        // Transform user data to DTO in the controller
        result.user = toLoginUserDTO(result.user);

        sendSuccess(res, result, 200);
    } catch (error) {
        next(error)
    }
}

export async function refresh(req, res, next) {
    try {
        const { refreshToken } = req.body;

        const tokens = await authService.refresh(refreshToken);
        const tokenDTO = toTokenResponseDTO(tokens.accessToken, tokens.refreshToken);
        sendSuccess(res, tokenDTO);
    } catch (error) {
        next(error)
    }
}

export async function logout(req, res, next) {
    try {
        // El middleware 'authenticate' ya ha verificado el accessToken y ha adjuntado el usuario a req.user
        const { refreshToken } = req.body;
        const user = req.user;

        const result = await authService.logout(refreshToken, user, req);
        sendSuccess(res, result);
    } catch (error) {
        next(error);
    }
}

export async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body;
        const tenantId = req.headers['x-tenant-id'];

        // La llamada al servicio se hace, pero no se espera (await) intencionadamente
        // para responder inmediatamente al cliente. El proceso sigue en segundo plano.
        authService.handleForgotPassword(email, tenantId, req);

        sendSuccess(res, { message: 'Si tu correo está registrado, recibirás un enlace para recuperar tu contraseña.' });
    } catch (error) {
        next(error);
    }
}

export async function resetPassword(req, res, next) {
    try {
        const { token, password } = req.body;

        const result = await authService.handleResetPassword(token, password);

        sendSuccess(res, result);
    } catch (error) {
        next(error);
    }
}

export async function getProfile(req, res, next) {
    try {
        const userId = req.user.userId;

        const userProfile = await authService.getUserProfile(userId);
        const profileDTO = toUserProfileDTO(userProfile);

        sendSuccess(res, profileDTO);
    } catch (error) {
        next(error);
    }
}