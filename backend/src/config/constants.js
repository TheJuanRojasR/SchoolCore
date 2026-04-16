'use strict';

/**
 * @module config/constants
 * @description
 * Este módulo centraliza todas las constantes y valores fijos utilizados a lo largo de la aplicación.
 * El propósito es mantener una "única fuente de verdad" para valores como roles, tipos de documento, estados, etc.,
 * evitando así el uso de "magic strings" (cadenas de texto literales) dispersas en el código.
 *
 * Todas las constantes se exportan como arrays congelados (`Object.freeze`) para prevenir
 * modificaciones accidentales durante la ejecución, garantizando su inmutabilidad.
 *
 * Estas constantes son ideales para ser utilizadas en:
 * - Definiciones de esquemas de Mongoose (para la propiedad `enum`).
 * - Reglas de validación (por ejemplo, con Joi).
 * - Lógica de negocio que necesita comparar contra valores específicos.
 */

export const DOC_TYPES = Object.freeze(['CC', 'TI', 'CE', 'PEP', 'PA', 'RC']);

export const GENDERS = Object.freeze(['MASCULINO', 'FEMENINO', 'NO_BINARIO', 'NO_INFORMA']);

export const BLOOD_TYPES = Object.freeze(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);

export const ETHNICITIES = Object.freeze(['INDIGENA', 'AFROCOLOMBIANO', 'ROM', 'OTRO']);

export const EDUCATION_SECTORS = Object.freeze(['OFICIAL', 'PRIVADO', 'CONCESION']);

export const CALENDARS = Object.freeze(['A', 'B']);

export const SHIFTS = Object.freeze(['MAÑANA', 'TARDE', 'NOCHE', 'UNICA', 'SABATINA']);

export const SYSTEM_ROLES = ['SUPERADMIN', 'RECTOR', 'COORDINADOR', 'SECRETARIA', 'DOCENTE', 'ACUDIENTE', 'ESTUDIANTE'];

export const PERMISSION_ACTIONS = ['CREATE', 'READ', 'UPDATE', 'DELETE'];

export const STUDENT_STATUSES = Object.freeze(['ACTIVO', 'RETIRADO', 'EGRESADO']);

export const TEACHER_STATUSES = Object.freeze(['ACTIVO', 'INACTIVO', 'LICENCIA']);

export const CONTRACT_TYPES = Object.freeze(['PLANTA', 'PROVISIONAL', 'CONTRATO']);

export const ESCALAFONES = Object.freeze(['1278', '2277']);

export const EDUCATION_LEVELS = Object.freeze(['NINGUNO', 'PRIMARIA', 'SECUNDARIA', 'BACHILLERATO', 'TECNICO']);

export const DISABILITY_TYPES = Object.freeze(['VISUAL', 'AUDITIVA', 'COGNITIVA', 'MOTORA', 'MULTIPLE']);

export const ENROLLMENT_STATUSES = Object.freeze(['ACTIVO', 'RETIRADO', 'TRASLADADO']);

export const AUDIT_ACTIONS = Object.freeze(['CREATE','UPDATE','DELETE','LOGIN','LOGOUT','PASSWORD_RESET_REQUEST','PASSWORD_RESET_COMPLETE']);

export const TOKEN_INVALIDATION_REASONS = Object.freeze(['LOGOUT', 'REVOKED', 'SECURITY_BREACH']);