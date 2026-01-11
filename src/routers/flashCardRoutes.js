import { Router } from "express";
import { validateBody } from "../middlewares/validation.js";
import { createFlashCardSchema, modifyFlashCardSchema} from "../models/flashCard.js";
import { deleteFlashcard, getAllFlashcards, createFlashcard, modifyFlashCard } from "../controllers/flashCardController.js";
import {authenticatetoken} from '../middlewares/authentificationToken.js'

const router = Router()

router.use(authenticatetoken)

router.get('/', getAllFlashcards)

router.post('/', validateBody(createFlashCardSchema), createFlashcard)

router.delete('/:id', deleteFlashcard)

router.patch('/:id', validateBody(modifyFlashCardSchema),modifyFlashCard)

export default router