'use strict';

import { Router } from "express";
import * as controller from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { loginSchema, refreshSchema, logoutSchema } from "./auth.validator.js";

const router = Router();

router.post('/login', validate(loginSchema), controller.login);
router.post('/refresh',validate(refreshSchema), controller.refresh);
router.post('/logout', authenticate, validate(logoutSchema), controller.logout);

export default router;