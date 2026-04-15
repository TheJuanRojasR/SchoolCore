'use strict';

import { Router } from "express";
import * as controller from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginSchema } from "./auth.validator.js";

const router = Router();

router.post('/login', validate(loginSchema), controller.login);

export default router;