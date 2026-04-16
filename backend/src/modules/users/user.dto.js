'use strict';

/**
 * @module modules/users/user.dto
 * @description Este módulo centraliza los Data Transfer Objects (DTOs) para el modelo User.
 * Su propósito es definir la "forma" de los datos que se envían al cliente,
 * asegurando que solo se exponga la información necesaria y segura.
 */

/**
 * Transforma un objeto de usuario a un DTO para la respuesta de login.
 * @param {object} user - El objeto de usuario desde la base de datos.
 * @returns {object | null} El objeto de usuario simplificado para la respuesta de login.
 */
export function toLoginUserDTO(user) {
    if (!user) return null;

    return {
        id: user._id,
        email: user.email,
        roles: user.roles.map(role => role.name),
        permissions: user.roles.flatMap(role => role.permissions),
        tenantId: user.tenantId,
    };
}

/**
 * Transforma un objeto de usuario de la base de datos a un DTO para el endpoint de perfil.
 * @param {object} user - El objeto de usuario populado desde la base de datos.
 * @returns {object | null} El objeto de perfil de usuario limpio y seguro, o null si no hay usuario.
 */
export function toUserProfileDTO(user) {
    if (!user) return null;

    return {
        id: user._id,
        email: user.email,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        person: user.personId, // Resultado de .populate('personId', ...)
        tenant: user.tenantId,   // Resultado de .populate('tenantId', ...)
        roles: user.roles.map(role => ({
            name: role.name,
            permissions: role.permissions,
        })),
    };
}