import { Router } from "express";
import { validateBody } from "../middlewares/validation.js";
import { createFlashCardSchema, updateFlashCardSchema} from "../models/flashCard.js";
import { deleteFlashcard, getAllFlashcards, createFlashcard, updateFlashcard, getFlashcardsByCollection, getFlashcardById } from "../controllers/flashCardController.js";
import {authenticatetoken} from '../middlewares/authentificationToken.js'

const router = Router()

router.use(authenticatetoken)

router.get('/', getAllFlashcards)

router.get('/:id', getFlashcardById)

router.get('/collection/:collectionId', getFlashcardsByCollection)

router.post('/', validateBody(createFlashCardSchema), createFlashcard)

router.put('/:id', validateBody(updateFlashCardSchema), updateFlashcard)

router.delete('/:id', deleteFlashcard)

export default router