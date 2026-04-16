'use strict';

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { findUserByEmail, updateUserLastLogin, findUserById, saveResetToken, findUserByResetToken, updatePasswordAndClearToken } from '../users/user.repository.js';
import * as tokenBlacklistRepository from './tokenBlackList.repository.js';
import * as emailService from './email.service.js';
import { UnauthorizedError, ForbiddenError } from '../../utils/index.js';
import { TOKEN_INVALIDATION_REASONS } from '../../config/constants.js';
import { comparePassword, verifyRefreshToken, createHash, hashPassword } from '../../utils/index.js';
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

    // 1. Verificar si el token está en la lista negra
    const isBlacklisted = await tokenBlacklistRepository.findByToken(refreshToken);

    if (isBlacklisted) {
        throw new UnauthorizedError('Token inválido o la sesión ha sido cerrada.');
    }

    try {
        const payload = verifyRefreshToken(refreshToken);
        const user = await findUserById(payload.userId);

        if (!user || !user.isActive) {
            throw new UnauthorizedError('Usuario no disponible');
        }

        /* DEUDA TÉCNICA: Validación de Tenant
        */
        // const tenant = await findTenantById(user.tenantId); 
        // if (!tenant || !tenant.isActive) {
        //     throw new UnauthorizedError('La institución educativa no está activa');
        // }

        // 2. Invalidar el token de refresco que se acaba de usar, añadiéndolo a la lista negra.
        const decodedOldToken = jwt.decode(refreshToken);

        if (decodedOldToken) {
            const blacklistEntry = {
                token: refreshToken,
                userId: user._id,
                tenantId: user.tenantId,
                expiresAt: new Date(decodedOldToken.exp * 1000),
                metadata: {
                    reason: 'REVOKED',
                },
            };

            // No se espera (await) para responder más rápido al cliente.
            tokenBlacklistRepository.add(blacklistEntry);
        }

        // 3. Generar un nuevo par de tokens (Access y Refresh). Esto se conoce como "Token Rotation".
        const tokenPayload = buildTokenPayload(user);
        const newAccessToken = singAccessToken(tokenPayload);
        const newRefreshToken = singRefreshToken({ userId: user._id.toString() });

        // 4. Devolver los nuevos tokens. El cliente DEBE guardar el nuevo refreshToken.
        return { accessToken: newAccessToken, refreshToken: newRefreshToken, expiresIn: ACCESS_TOKEN_EXPIRATION_IN_SECONDS };

    } catch (error) {
        if (error.isOperational) throw error;
        throw new UnauthorizedError('Token inválido o expirado');
    }
}
// -------------------------------------------------------------------------------
// 3. Funcion para logout
export async function logout(refreshToken, user, req) {

    // 1. Verificación de idempotencia: si el token ya está en la lista negra, no hacer nada.
    const isBlacklisted = await tokenBlacklistRepository.findByToken(refreshToken);

    if (isBlacklisted) {
        return { message: 'La sesión ya ha sido cerrada previamente.' };
    }

    // 2. Decodificar el token para obtener su payload, especialmente la fecha de expiración (exp)
    const decoded = jwt.decode(refreshToken);

    if (!decoded) {
        return { message: 'No se requiere ninguna acción.' };
    }

    // 3. Verificación de seguridad: Asegurarse de que el refreshToken pertenece al usuario autenticado.
    // Esto previene que un usuario A (autenticado con accessToken) pueda invalidar el refreshToken de un usuario B.
    if (decoded.userId !== user.userId) {
        throw new ForbiddenError('No tiene permiso para invalidar este token de sesión.');
    }

    // 4. Construir el objeto para la lista negra
    const blacklistEntry = {
        token: refreshToken,
        userId: decoded.userId, // Principio de la fuente única: usar el ID del token que se está invalidando.
        tenantId: user.tenantId, // El tenantId se puede seguir tomando del accessToken verificado para consistencia.
        expiresAt: new Date(decoded.exp * 1000), // El payload 'exp' está en segundos, se convierte a milisegundos para el objeto Date
        metadata: {
            ip: req.ip,
            userAgent: req.get('User-Agent') || 'unknown',
            reason: 'LOGOUT',
        },
    };

    // 5. Añadir a la lista negra usando el repositorio
    tokenBlacklistRepository.add(blacklistEntry);

    return { message: 'Sesión cerrada exitosamente.' };
}

// -------------------------------------------------------------------------------
// 4. Funcion para solicitar recuperacion de contraseña
export async function handleForgotPassword(email, tenantId, req) {
    // 1. Buscar al usuario de forma segura
    const user = await findUserByEmail(tenantId, email);

    // 2. Validación silenciosa: si el usuario no existe o no está activo, no hacer nada.
    // Esto previene la enumeración de usuarios.
    if (!user || !user.isActive) {
        return;
    }

    // --- Si el usuario es válido, proceder ---

    // 3. Generar un token criptográficamente seguro para el usuario
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 4. Hashear el token para almacenarlo en la base de datos (nunca guardar en texto plano)
    const hashedToken = createHash(resetToken);

    // 5. Establecer la fecha de expiración (15 minutos desde ahora)
    const expirationDate = new Date(Date.now() + 15 * 60 * 1000);

    // 6. Guardar el token hasheado y la expiración en el documento del usuario
    await saveResetToken(user._id, hashedToken, expirationDate);

    // 7. Enviar el correo con el token en texto plano (tarea asíncrona)
    // Se asume que el objeto 'user' tiene la información de 'person' y 'tenant' populada o se puede buscar.
    // Para este ejemplo, simularemos esos datos.
    const simulatedTenant = { name: 'Colegio de Prueba' }; // En un caso real, se buscaría el tenant.
    const simulatedPerson = { name: { first: 'Usuario' } }; // En un caso real, se buscaría la persona.
    
    emailService.sendPasswordRecoveryLink(
        { ...user, person: simulatedPerson },
        resetToken,
        simulatedTenant
    );
}

// -------------------------------------------------------------------------------
// 5. Funcion para restablecer la contraseña
export async function handleResetPassword(token, newPassword) {
    // 1. Hashear el token recibido para buscarlo en la BD
    const hashedToken = createHash(token);

    // 2. Buscar al usuario por el token hasheado
    const user = await findUserByResetToken(hashedToken);

    // 3. Validar el token y al usuario
    if (!user || new Date() > user.security.resetExpires) {
        throw new UnauthorizedError('El token es inválido o ha expirado.');
    }

    if (!user.isActive) {
        throw new ForbiddenError('La cuenta de usuario está desactivada.');
    }

    // 4. Validar que la nueva contraseña no sea igual a la anterior
    const isSamePassword = await comparePassword(newPassword, user.passwordHash);
    if (isSamePassword) {
        throw new ForbiddenError('La nueva contraseña no puede ser igual a la anterior.');
    }

    // 5. Hashear la nueva contraseña para guardarla
    const newPasswordHash = await hashPassword(newPassword);

    // 6. Actualizar la contraseña e invalidar el token en una sola operación
    await updatePasswordAndClearToken(user._id, newPasswordHash);

    // 7. Enviar correo de confirmación (tarea asíncrona)
    // Para este ejemplo, simularemos esos datos.
    const simulatedPerson = { name: { first: 'Usuario' } }; // En un caso real, se buscaría la persona.
    emailService.sendPasswordChangeConfirmation({ ...user, person: simulatedPerson });

    // 8. Registrar en auditoría (cuando se implemente)
    // auditService.log({ action: 'PASSWORD_RESET_COMPLETE', ... });

    return { message: 'Tu contraseña ha sido actualizada exitosamente.' };
}