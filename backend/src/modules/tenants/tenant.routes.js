'use strict';

import { Router } from "express";
import * as controller from "./tenant.controller.js";
import { validate } from "../../middlewares/validate.middleware.js"
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorization.middleware.js";
import { createTenantSchema } from "./tenant.validator.js";

const router = Router();

router.post(
    '/',
    authenticate,
    authorize('tenants', 'CREATE'), // Ahora verificamos el permiso específico
    validate(createTenantSchema),
    controller.createTenant);

export default router;