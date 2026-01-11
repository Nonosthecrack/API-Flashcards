import { Router } from "express";
import { validateBody } from "../middlewares/validation.js";
import { loginSchema, createUser } from "../models/userAuth.js";
import { register, login, me } from "../controllers/authController.js";
import { authenticatetoken } from "../middlewares/authentificationToken.js"



const router = Router()

router.post('/register', validateBody(createUser), register)
router.post('/login', validateBody(loginSchema), login)
router.get('/me', authenticatetoken, me)

export default router;