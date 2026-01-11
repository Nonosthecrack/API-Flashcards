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
    try{
        const {rectoText, versoText, rectoUrl, versoUrl, collectionId} = req.body //ptet supprimer ownerId  du coup

        const userId = req.user.userId

        await db.insert(flashCardTable).values({rectoText: rectoText, rectoUrl: rectoUrl, versoText: versoText, versoUrl: versoUrl, collectionId: collectionId, ownerId: userId})
    
        res.status(201).json({
            message : "Flashcard succesfully created"
        })

    } catch (error){
        console.error(error)
        res.status(500).json({
            error:"Failed to create Flashcard"
        })
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