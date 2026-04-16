'use strict';

import { Router } from "express";
import * as controller from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { forgotPasswordLimiter } from "../../middlewares/rateLimit.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { loginSchema, refreshSchema, logoutSchema, forgotPasswordSchema } from "./auth.validator.js";

const router = Router();

router.post('/login', validate(loginSchema), controller.login);
router.post('/refresh',validate(refreshSchema), controller.refresh);
router.post('/logout', authenticate, validate(logoutSchema), controller.logout);
router.post('/forgot-password', forgotPasswordLimiter, validate(forgotPasswordSchema), controller.forgotPassword);

export default router;