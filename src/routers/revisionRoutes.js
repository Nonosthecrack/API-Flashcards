import { Router } from "express"
import { authenticatetoken } from "../middlewares/authentificationToken.js"
import { getFlashcardsToReview, reviewFlashcard } from "../controllers/revisionController.js"

const router = Router()

router.use(authenticatetoken)
router.get("/to-review", getFlashcardsToReview)
router.post('/review/:flashCardId', reviewFlashcard)


export default router
