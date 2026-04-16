'use strict';

import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';

// Importar modelos
import { Tenant } from '../modules/tenants/tenant.model.js';
import { Role } from '../modules/roles/role.model.js';
import { Person } from '../modules/persons/person.model.js';
import { User } from '../modules/users/user.model.js';

import { hashPassword } from '../utils/index.js';

const rolesJSON = [
    {
        "name": "RECTOR",
        "description": "Administrador principal de la institución con acceso total a la gestión operativa y académica.",
        "isSystem": true,
        "permissions": [
            { "resource": "tenants", "actions": ["READ", "UPDATE"] },
            { "resource": "roles", "actions": ["CREATE", "READ", "UPDATE", "DELETE"] },
            { "resource": "users", "actions": ["CREATE", "READ", "UPDATE", "DELETE"] },
            { "resource": "academic_structure", "actions": ["CREATE", "READ", "UPDATE", "DELETE"] },
            { "resource": "students", "actions": ["CREATE", "READ", "UPDATE", "DELETE"] },
            { "resource": "teachers", "actions": ["CREATE", "READ", "UPDATE", "DELETE"] },
            { "resource": "enrollments", "actions": ["CREATE", "READ", "UPDATE", "DELETE"] }
        ]
    },
    {
        "name": "COORDINADOR",
        "description": "Encargado de la gestión académica y disciplinaria, con permisos de creación y modificación, pero sin acceso a configuración de seguridad.",
        "isSystem": true,
        "permissions": [
            { "resource": "users", "actions": ["READ"] },
            { "resource": "academic_structure", "actions": ["CREATE", "READ", "UPDATE"] },
            { "resource": "students", "actions": ["CREATE", "READ", "UPDATE"] },
            { "resource": "teachers", "actions": ["READ", "UPDATE"] },
            { "resource": "enrollments", "actions": ["CREATE", "READ", "UPDATE"] }
        ]
    },
    {
        "name": "SECRETARIA",
        "description": "Personal administrativo enfocado en el registro, actualización de datos y procesos de matrícula.",
        "isSystem": true,
        "permissions": [
            { "resource": "students", "actions": ["CREATE", "READ", "UPDATE"] },
            { "resource": "guardians", "actions": ["CREATE", "READ", "UPDATE"] },
            { "resource": "enrollments", "actions": ["CREATE", "READ", "UPDATE"] },
            { "resource": "academic_structure", "actions": ["READ"] }
        ]
    },
    {
        "name": "DOCENTE",
        "description": "Profesor con acceso limitado a su propia información, sus grupos asignados y la gestión de notas/asistencia.",
        "isSystem": true,
        "permissions": [
            { "resource": "teachers", "actions": ["READ", "UPDATE"] },
            { "resource": "academic_structure", "actions": ["READ"] },
            { "resource": "students", "actions": ["READ"] },
            { "resource": "attendance", "actions": ["CREATE", "READ", "UPDATE"] },
            { "resource": "grades", "actions": ["CREATE", "READ", "UPDATE"] }
        ]
    },
    {
        "name": "ESTUDIANTE",
        "description": "Usuario de solo lectura para consultar su propio estado académico y perfil.",
        "isSystem": true,
        "permissions": [
            { "resource": "students", "actions": ["READ"] },
            { "resource": "enrollments", "actions": ["READ"] },
            { "resource": "academic_structure", "actions": ["READ"] }
        ]
    },
    {
        "name": "ACUDIENTE",
        "description": "Responsable legal con acceso a la información de sus acudidos y actualización de sus propios datos de contacto.",
        "isSystem": true,
        "permissions": [
            { "resource": "guardians", "actions": ["READ", "UPDATE"] },
            { "resource": "students", "actions": ["READ"] },
            { "resource": "enrollments", "actions": ["READ"] }
        ]
    }
];

async function seed() {
    try {
        await connectDB();
        console.log('📦 Conectado a MongoDB. Iniciando proceso de Seed...\n');

        // 1. Limpiar colecciones
        await Promise.all([
            Role.deleteMany({}),
            Tenant.deleteMany({}),
            Person.deleteMany({}),
            User.deleteMany({})
        ]);
        console.log('🧹 Base de datos limpiada.');

        // 2. Crear Instituciones (Tenants)
        const tenant1 = await Tenant.create({
            name: "Colegio de Desarrollo San José",
            nit: { number: "900123456", checkDigit: "1" },
            daneCode: "111111111111",
            daneMunicipality: "11001",
            educationSector: "PRIVADO",
            educationCalendar: "A",
            contact: { address: "Calle Falsa 123", phone: "6011234567", email: "contacto@sanjose.edu.co" },
            rector: { name: "Carlos Rector" }
        });

        const tenant2 = await Tenant.create({
            name: "Institución Educativa Distrital Bosa",
            nit: { number: "800987654", checkDigit: "2" },
            daneCode: "222222222222",
            daneMunicipality: "11001",
            educationSector: "OFICIAL",
            educationCalendar: "B",
            contact: { address: "Carrera 45 # 23-11", phone: "6019876543", email: "info@iedbosa.edu.co" },
            rector: { name: "Maria Directora" }
        });
        console.log('🏫 2 Instituciones creadas.');

        // 3. Crear Roles
        const superAdminRole = await Role.create({
            name: 'SUPERADMIN',
            description: 'Administrador global del sistema.',
            isSystem: true,
            permissions: [{ resource: 'all', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE'] }]
        });

        const systemRoles = await Role.insertMany(rolesJSON);
        console.log(`🛡️ ${systemRoles.length + 1} Roles creados (incluyendo SUPERADMIN).`);

        const buildUserRole = (role) => ({
            roleId: role._id,
            name: role.name,
            permissions: role.permissions.map(permission => ({
                resource: permission.resource,
                actions: permission.actions
            })),
            assignedAt: new Date(),
        });

        const getRoleByName = (name) => {
            if (name === 'SUPERADMIN') return superAdminRole;
            return systemRoles.find(role => role.name === name);
        };

        // 4. Crear Personas
        // Crearemos 7 personas (1 para superadmin, 6 para representar cada rol restante)
        const personsData = [
            {
                tenantId: tenant1._id,
                name: { first: 'Admin', firstSurname: 'System' },
                document: { type: 'CC', number: '1000000000' },
                gender: 'MASCULINO',
                bloodType: 'O+',
                birth: { date: new Date('1985-01-01') },
            }, // 0: Superadmin
            {
                tenantId: tenant1._id,
                name: { first: 'Carlos', firstSurname: 'Rector' },
                document: { type: 'CC', number: '1000000001' },
                gender: 'MASCULINO',
                bloodType: 'A+',
                birth: { date: new Date('1975-03-12') },
            }, // 1: Rector
            {
                tenantId: tenant1._id,
                name: { first: 'Maria', firstSurname: 'Coord' },
                document: { type: 'CC', number: '1000000002' },
                gender: 'FEMENINO',
                bloodType: 'O-',
                birth: { date: new Date('1980-06-20') },
            }, // 2: Coordinador
            {
                tenantId: tenant1._id,
                name: { first: 'Luisa', firstSurname: 'Secre' },
                document: { type: 'CC', number: '1000000003' },
                gender: 'FEMENINO',
                bloodType: 'B+',
                birth: { date: new Date('1988-09-05') },
            }, // 3: Secretaria
            {
                tenantId: tenant1._id,
                name: { first: 'Pedro', firstSurname: 'Profe' },
                document: { type: 'CC', number: '1000000004' },
                gender: 'MASCULINO',
                bloodType: 'A-',
                birth: { date: new Date('1990-11-15') },
            }, // 4: Docente
            {
                tenantId: tenant2._id,
                name: { first: 'Juan', firstSurname: 'Alumno' },
                document: { type: 'TI', number: '1000000005' },
                gender: 'MASCULINO',
                bloodType: 'O+',
                birth: { date: new Date('2008-05-10') },
            }, // 5: Estudiante
            {
                tenantId: tenant2._id,
                name: { first: 'Ana', firstSurname: 'Acudiente' },
                document: { type: 'CC', number: '1000000006' },
                gender: 'FEMENINO',
                bloodType: 'AB+',
                birth: { date: new Date('1982-02-25') },
            }, // 6: Acudiente
        ];
        const persons = await Person.insertMany(personsData);
        console.log(`👥 ${persons.length} Personas creadas.`);

        // 5. Crear Usuarios
        const defaultPassword = await hashPassword('Password123!');

        const usersData = [
            // Superadmin Global (lo atamos al tenant 1 pero con rol SUPERADMIN)
            {
                tenantId: tenant1._id,
                personId: persons[0]._id,
                email: 'admin@system.com',
                passwordHash: defaultPassword,
                roles: [buildUserRole(getRoleByName('SUPERADMIN'))],
                isActive: true,
            },

            // Usuarios Tenant 1 (Colegio San José)
            {
                tenantId: tenant1._id,
                personId: persons[1]._id,
                email: 'rector@sanjose.edu.co',
                passwordHash: defaultPassword,
                roles: [buildUserRole(getRoleByName('RECTOR'))],
                isActive: true,
            },
            {
                tenantId: tenant1._id,
                personId: persons[2]._id,
                email: 'coord@sanjose.edu.co',
                passwordHash: defaultPassword,
                roles: [buildUserRole(getRoleByName('COORDINADOR'))],
                isActive: true,
            },
            {
                tenantId: tenant1._id,
                personId: persons[3]._id,
                email: 'sec@sanjose.edu.co',
                passwordHash: defaultPassword,
                roles: [buildUserRole(getRoleByName('SECRETARIA'))],
                isActive: true,
            },
            {
                tenantId: tenant1._id,
                personId: persons[4]._id,
                email: 'docente@sanjose.edu.co',
                passwordHash: defaultPassword,
                roles: [buildUserRole(getRoleByName('DOCENTE'))],
                isActive: true,
            },
            {
                tenantId: tenant1._id,
                personId: persons[5]._id,
                email: 'estudiante@sanjose.edu.co',
                passwordHash: defaultPassword,
                roles: [buildUserRole(getRoleByName('ESTUDIANTE'))],
                isActive: true,
            },
            {
                tenantId: tenant1._id,
                personId: persons[6]._id,
                email: 'acudiente@sanjose.edu.co',
                passwordHash: defaultPassword,
                roles: [buildUserRole(getRoleByName('ACUDIENTE'))],
                isActive: true,
            },

            // Usuarios Tenant 2 (IED Bosa) - Usamos algunas de las mismas personas físicas, pero con emails de este otro colegio (Multi-tenant)
            {
                tenantId: tenant2._id,
                personId: persons[1]._id,
                email: 'rector@iedbosa.edu.co',
                passwordHash: defaultPassword,
                roles: [buildUserRole(getRoleByName('RECTOR'))],
                isActive: true,
            },
            {
                tenantId: tenant2._id,
                personId: persons[4]._id,
                email: 'docente@iedbosa.edu.co',
                passwordHash: defaultPassword,
                roles: [buildUserRole(getRoleByName('DOCENTE'))],
                isActive: true,
            },
            {
                tenantId: tenant2._id,
                personId: persons[5]._id,
                email: 'estudiante@iedbosa.edu.co',
                passwordHash: defaultPassword,
                roles: [buildUserRole(getRoleByName('ESTUDIANTE'))],
                isActive: true,
            },
            {
                tenantId: tenant2._id,
                personId: persons[6]._id,
                email: 'acudiente@iedbosa.edu.co',
                passwordHash: defaultPassword,
                roles: [buildUserRole(getRoleByName('ACUDIENTE'))],
                isActive: true,
            },
        ];
        await User.insertMany(usersData);
        console.log(`👤 ${usersData.length} Usuarios creados exitosamente.\n`);
        console.log('✅ Seed finalizado. Contraseña para todos los usuarios: Password123!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error ejecutando el Seed:', error);
        process.exit(1);
    }
}

seed();