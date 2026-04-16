// server.js : Arranca el servidor
// - Conecta la DB
// - Inicia el servidor

// Carga todas las variables de entorno de forma global (process.env)
import 'dotenv/config';
import app from './app.js';
import connectDB from './config/database.js';

import './modules/tenants/tenant.model.js'; // Importar el modelo Tenant
import './modules/persons/person.model.js';

const PORT = process.env.PORT || 3000;

async function main() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        // Detiene la aplicación si la DB no se pudo conectar
        process.exit(1);
    }
}

main();