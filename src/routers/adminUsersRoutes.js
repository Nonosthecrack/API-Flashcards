import { Router } from "express";
import { authenticatetoken } from "../middlewares/authentificationToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {getAllUsers,getUserById,deleteUserById} from "../controllers/adminuserController.js";

const router = Router();

router.use(authenticatetoken);
router.use(isAdmin);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUserById);

export default router;
