import {db} from "../db/database.js"
import { collectionTable, flashCardTable } from "../db/schema.js"
import {eq, or} from 'drizzle-orm'

export const getAllFlashcards = async (req, res) => {
    try{



        var flashCards = await db.select({ rectoText: flashCardTable.rectoText }).from(flashCardTable).innerJoin(
        collectionTable,
        eq(flashCardTable.collectionId, collectionTable.id))
        .where(
            or(
                eq(collectionTable.visibility, 'public'),
                eq(collectionTable.ownerId, req.user.userId)
            ))

        if(req.user.role == 'ADMIN'){
            flashCards = await db.select({ rectoText: flashCardTable.rectoText }).from(flashCardTable).innerJoin(
            collectionTable,
            eq(flashCardTable.collectionId, collectionTable.id)) 
        }
        

        res.status(200).json(flashCards)

    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: "Failed to fetch Flashcards"
        })
    }
}

export const createFlashcard = async (req, res) => {
    try {
        const { rectoText, versoText, rectoUrl, versoUrl, collectionId } = req.body
        const userId = req.user.userId

        const [collection] = await db
            .select()
            .from(collectionTable)
            .where(eq(collectionTable.id, collectionId))
            .limit(1)

        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' })
        }

        if (collection.ownerId !== userId) {
            return res.status(403).json({
                error: 'You can only add flashcards to your own collections'
            })
        }

        await db.insert(flashCardTable).values({
            rectoText,
            versoText,
            rectoUrl,
            versoUrl,
            collectionId,
            ownerId: userId
        })

        res.status(201).json({ message: 'Flashcard created successfully' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to create flashcard' })
    }
}

export const getFlashcardById = async (req, res) => {
    try {
        const { id } = req.params

        const [result] = await db
            .select()
            .from(flashCardTable)
            .innerJoin(
                collectionTable,
                eq(flashCardTable.collectionId, collectionTable.id)
            )
            .where(eq(flashCardTable.id, id))
            .limit(1)

        if (!result) {
            return res.status(404).json({ error: 'Flashcard not found' })
        }

        const { FlashCards, Collection } = result
        const isOwner = Collection.ownerId === req.user.userId
        const isAdmin = req.user.role === 'ADMIN'

        if (Collection.visibility === 'private' && !isOwner && !isAdmin) {
            return res.status(403).json({ error: 'Access denied' })
        }

        res.status(200).json(FlashCards)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch flashcard' })
    }
}

export const getFlashcardsByCollection = async (req, res) => {
    try {
        const { collectionId } = req.params

        const [collection] = await db
            .select()
            .from(collectionTable)
            .where(eq(collectionTable.id, collectionId))
            .limit(1)

        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' })
        }

        const isOwner = collection.ownerId === req.user.userId
        const isAdmin = req.user.role === 'ADMIN'

        if (collection.visibility === 'private' && !isOwner && !isAdmin) {
            return res.status(403).json({ error: 'Access denied' })
        }

        const flashcards = await db
            .select()
            .from(flashCardTable)
            .where(eq(flashCardTable.collectionId, collectionId))

        res.status(200).json(flashcards)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch flashcards' })
    }
}


export const deleteFlashcard = async (req, res) => {
    try {
        const { id } = req.params  

        const [flashcard] = await db
            .select()
            .from(flashCardTable)
            .where(eq(flashCardTable.id, id))

        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found' })
        }

        if (req.user.userId === flashcard.ownerId || req.user.role === 'ADMIN') {
            const [deletedFlashcard] = await db
                .delete(flashCardTable)
                .where(eq(flashCardTable.id, id))
                .returning()

            return res.status(200).json({ 
                message: 'Flashcard deleted successfully' 
            })
        } else {
            return res.status(403).json({
                error: "You aren't allowed to delete this flashcard"
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: "Failed to delete flashcard"
        })
    }
}

export const updateFlashcard = async (req, res) => {
    try {
        const { id } = req.params

        const [result] = await db
            .select()
            .from(flashCardTable)
            .innerJoin(
                collectionTable,
                eq(flashCardTable.collectionId, collectionTable.id)
            )
            .where(eq(flashCardTable.id, id))
            .limit(1)

        if (!result) {
            return res.status(404).json({ error: 'Flashcard not found' })
        }

        const { FlashCards, Collection } = result

        if (Collection.ownerId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' })
        }

        await db
            .update(flashCardTable)
            .set(req.body)
            .where(eq(flashCardTable.id, id))

        res.status(200).json({ message: 'Flashcard updated successfully' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to update flashcard' })
    }
}
