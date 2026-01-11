import { Router } from "express";
import { validateBody } from "../middlewares/validation.js";
import { createCollectionSchema, updateCollectionSchema} from "../models/collection.js";
import {authenticatetoken} from '../middlewares/authentificationToken.js'
import { getAllCollection,createCollection, getMyCollections, deleteCollection, getCollectionById, updateCollection } from "../controllers/collectionController.js";

const router = Router()

router.use(authenticatetoken)

router.get('/', getAllCollection)

router.get('/:id', getCollectionById)

router.get('/me/list', getMyCollections)

router.post('/', validateBody(createCollectionSchema), createCollection)

router.put('/:id', validateBody(updateCollectionSchema), updateCollection)

router.delete('/:id', deleteCollection)

export default router