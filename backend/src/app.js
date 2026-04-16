// app.js : Configuracion de express
// - Como se comporta la API
// - Que middleware utiliza
// - Que rutas existen

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import tenantRoutes from './modules/tenants/tenant.routes.js';

const app = express();

// Midlleware ----------------------
// Permite que el frontend se conecte
app.use(cors());
// Seguridad basica en HTTP headers
app.use(helmet());
// Logs de peticiones
app.use(morgan('dev'));
// Transforma json - objeto js
app.use(express.json());
// Transforma formularios HTML - objeto js
app.use(express.urlencoded({ extended: true }));

// Ruta prueba ---------------------
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// Rutas API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tenants', tenantRoutes);

// Middleware para manejo de errores globales
app.use(errorHandler);

export default app;