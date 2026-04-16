'use strict';

// --- Placeholder para el Servicio de Correo ---
// Aquí se configuraría Nodemailer con SMTP o un proveedor como SendGrid.

/**
 * Envía un correo de recuperación de contraseña.
 * @param {object} user - El objeto del usuario destinatario.
 * @param {string} token - El token de recuperación en texto plano.
 * @param {object} tenant - El objeto del tenant (colegio).
 */
export async function sendPasswordRecoveryLink(user, token, tenant) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    console.log('--- SIMULACIÓN DE ENVÍO DE CORREO ---');
    console.log(`Para: ${user.email}`);
    console.log(`Asunto: Recuperación de contraseña para ${tenant.name}`);
    console.log(`Hola ${user.person.name.first}, haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`);
    console.log('------------------------------------');
    // En producción, aquí iría la lógica real de envío con `transporter.sendMail(...)`
}
