'use strict';

import { Router } from "express";
import * as controller from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginSchema, refreshSchema } from "./auth.validator.js";

const router = Router();

router.post('/login', validate(loginSchema), controller.login);
router.post('/refresh',validate(refreshSchema), controller.refresh);

export default router;