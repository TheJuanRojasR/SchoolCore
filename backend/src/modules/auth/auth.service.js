'use strict';

import { findUserByEmail, updateUserLastLogin, findUserById } from '../users/user.repository.js';
import { UnauthorizedError, ForbiddenError } from '../../utils/index.js';
import { comparePassword, verifyRefreshToken } from '../../utils/index.js';
import { singAccessToken, singRefreshToken, ACCESS_TOKEN_EXPIRATION_IN_SECONDS } from '../../utils/index.js';

// -------------------------------------------------------------------------------
// Helpeer privado
function buildTokenPayload(user) {
    return {
        userId: user._id.toString(),
        tenantId: user.tenantId.toString(),
        roles: user.roles.map(role => role.name),
        permissions: user.roles.flatMap(role => role.permissions),
    };
}

// -------------------------------------------------------------------------------
// 1. Funcion login
export async function login(tenantId, email, password) {

    // 1. Buscar Usuario
    const user = await findUserByEmail(tenantId, email);

    // 2. Verifica si el usuario existe
    if (!user) {
        throw new UnauthorizedError('Credenciales incorrectas');
    }

    // 3. Verifica si la cuenta esta activa
    if (!user.isActive) {
        throw new ForbiddenError('Cuenta deshabilitada');
    }

    // 4. Verifica contraseña
    const passwordOk = await comparePassword(password, user.passwordHash);

    if (!passwordOk) {
        throw new UnauthorizedError('Credenciales incorrectas');
    }

    // 5. Login exitoso
    const payload = buildTokenPayload(user);
    const accessToken = singAccessToken(payload);
    const refreshToken = singRefreshToken({ userId: user._id.toString() });

    // 6. Actualizar fecha de último login
    await updateUserLastLogin(user._id);

    return {
        accessToken,
        refreshToken,
        expiresIn: ACCESS_TOKEN_EXPIRATION_IN_SECONDS,
        user: {
            id: user._id,
            email: user.email,
            roles: user.roles.map(role => role.name),
            permissions: user.roles.flatMap(role => role.permissions),
            tenantId: user.tenantId,
        },
    };
}
// -------------------------------------------------------------------------------
// 2. Funcion de validacion Refresh token
export async function refresh(refreshToken) {
    let payload;
    try {
        payload = verifyRefreshToken(refreshToken);
    } catch (error) {
        throw new UnauthorizedError('Token inválido o expirado');
    }

    const user = await findUserById(payload.userId);

    if (!user || !user.isActive) {
        throw new UnauthorizedError('Usuario no disponible')
    }

    const tokenPayload = buildTokenPayload(user);
    const accessToken = singAccessToken(tokenPayload);

    return { accessToken, expiresIn: ACCESS_TOKEN_EXPIRATION_IN_SECONDS };
}
// -------------------------------------------------------------------------------