import { Router } from "express";
import { validateBody } from "../middlewares/validation.js";
import { loginSchema, createUser } from "../models/userAuth.js";
import { register, login } from "../controllers/authController.js";


const router = Router()

router.post('/register', validateBody(createUser), register)
router.post('/login', validateBody(loginSchema), login)

export default router;