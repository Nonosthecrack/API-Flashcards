import { Router } from "express";
import { validateBody } from "../middlewares/validation.js";
import { answer } from "../models/answerFlashCard.js";
import { studyFlashCard } from "../controllers/personnalFlashCardsController.js";


const router = Router()

router.patch('/:id', validateBody(answer), studyFlashCard)

export default router;