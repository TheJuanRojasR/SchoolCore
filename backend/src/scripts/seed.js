import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../modules/users/user.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Definición básica de esquemas faltantes para que el seed pueda insertar datos correctamente
const TenantSchema = new mongoose.Schema({ name: String });
const PersonSchema = new mongoose.Schema({ firstName: String, lastName: String });
const RoleSchema = new mongoose.Schema({ name: String, permissions: [String] });

const Tenant = mongoose.models.Tenant || mongoose.model('Tenant', TenantSchema);
const Person = mongoose.models.Person || mongoose.model('Person', PersonSchema);
const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema);

const seedDatabase = async () => {
    try {
        console.log('Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB conectado exitosamente.');

        console.log('Limpiando base de datos...');
        await Tenant.deleteMany({});
        await Person.deleteMany({});
        await Role.deleteMany({});
        await User.deleteMany({});

        console.log('Creando Colegios (Tenants)...');
        const tenantsData = [
            { name: 'Colegio Nacional San José' },
            { name: 'Institución Educativa Los Andes' },
            { name: 'Liceo Moderno del Norte' },
            { name: 'Escuela Técnica Superior' }
        ];
        const tenants = await Tenant.insertMany(tenantsData);

        console.log('Creando Roles...');
        const rolesData = [
            { name: 'ADMIN', permissions: ['ALL'] },
            { name: 'DOCENTE', permissions: ['READ_STUDENTS', 'UPDATE_GRADES'] },
            { name: 'ESTUDIANTE', permissions: ['READ_GRADES'] }
        ];
        const roles = await Role.insertMany(rolesData);

        const passwordString = '12345678';
        console.log(`Hasheando la contraseña por defecto: ${passwordString}...`);
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
        const passwordHash = await bcrypt.hash(passwordString, saltRounds);

        console.log('Creando Personas y Usuarios para las instituciones...');

        const usersData = [];
        
        // Vamos a distribuir 10 personas entre los 4 colegios
        const usersInfo = [
            { first: 'Carlos', last: 'Admin', email: 'carlos.admin@sanjose.edu', rol: roles[0], tenant: tenants[0] },
            { first: 'Maria', last: 'Docente', email: 'maria.docente@sanjose.edu', rol: roles[1], tenant: tenants[0] },
            { first: 'Juan', last: 'Alumno', email: 'juan.estudiante@sanjose.edu', rol: roles[2], tenant: tenants[0] },

            { first: 'Luis', last: 'Admin2', email: 'luis.admin@losandes.edu', rol: roles[0], tenant: tenants[1] },
            { first: 'Ana', last: 'DocenteA', email: 'ana.docente@losandes.edu', rol: roles[1], tenant: tenants[1] },

            { first: 'Pedro', last: 'AdminLiceo', email: 'pedro@liceo.edu', rol: roles[0], tenant: tenants[2] },
            { first: 'Sofia', last: 'Prof', email: 'sofia.prof@liceo.edu', rol: roles[1], tenant: tenants[2] },
            { first: 'Lucas', last: 'Est', email: 'lucas@liceo.edu', rol: roles[2], tenant: tenants[2] },

            { first: 'Marta', last: 'Directora', email: 'directora@tecnica.edu', rol: roles[0], tenant: tenants[3] },
            { first: 'Roberto', last: 'ProfesorT', email: 'roberto@tecnica.edu', rol: roles[1], tenant: tenants[3] },
        ];

        for (let i = 0; i < usersInfo.length; i++) {
            const info = usersInfo[i];
            
            // 1. Crear Persona
            const person = await Person.create({
                firstName: info.first,
                lastName: info.last
            });

            // 2. Crear Usuario interactuando los ObjectId
            const user = await User.create({
                tenantId: info.tenant._id,
                personId: person._id,
                email: info.email,
                passwordHash: passwordHash,
                isActive: true,
                roles: [{
                    roleId: info.rol._id,
                    name: info.rol.name,
                    permissions: info.rol.permissions
                }]
            });

            usersData.push(user);
        }

        console.log('\n=============================================');
        console.log('✅ SEED COMPLETADO CON ÉXITO');
        console.log('=============================================');
        
        console.log(`\nColegios creados: ${tenants.length}`);
        tenants.forEach(t => console.log(` - ID: ${t._id} | Nombre: ${t.name}`));

        console.log('\n📝 TUS USUARIOS DE PRUEBA:');
        console.log('Todos tienen la clave: 12345678\n');

        usersInfo.forEach(u => {
            console.log(`[${u.rol.name}] ${u.tenant.name}`);
            console.log(`-> Email: ${u.email}`);
            console.log(`-> Tenant ID (x-tenant-id para Postman/Frontend): ${u.tenant._id}`);
            console.log('---------------------------------------------');
        });

        process.exit(0);

    } catch (error) {
        console.error('Error durante el seed:', error);
        process.exit(1);
    }
};

seedDatabase();
