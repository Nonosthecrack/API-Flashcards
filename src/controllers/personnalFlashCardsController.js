import {db} from "../db/database.js"
import {flashCardTable, personnalFlashCardsTable } from "../db/schema.js"
import {eq, lt, or} from 'drizzle-orm'

export const studyFlashCard = async (req, res) => {

        
        const {idFC} = req.params
        const {userAnswer} = req.body

        //Est-ce que la carte a été révisée une fois ? 
        const notFirstStudy = await db.select(flashCardId).from(personnalFlashCardsTable)
        .where(
            and(
                eq(personnalFlashCardsTable.flashCardId, idFC),
                eq(personnalFlashCardsTable.userId, req.user.userId)
            )
        ).returning()

        if(notFirstStudy){
            //On met a jour la carte
            await db.update(personnalFlashCardsTable).set({
                level: sql`MIN(${personnalFlashCardsTable.level} + 1, 5)`,
                lastStudyDate: sql`datetime('now')`,
                nextStudyDate: sql`datetime('now','+' || pow(2, ${personnalFlashCardsTable.level}) || ' days')`,
            }).where(
                and(
                    eq(personnalFlashCardsTable.flashCardId, idFC),
                    eq(personnalFlashCardsTable.userId, req.user.userId),
                )
            )
            //On vérifie la réponse et on envoie a l'utilisateur
            const trueAnswer = await db.select(versoText).from(flashCardTable).where(eq(personnalFlashCardsTable.flashCardId, idFC))

            if(trueAnswer = userAnswer){
                return res.status(200).json({
                    message: "Good answer, the card has been updated"
                })
            } else {
                return res.status(200).json({
                    message: "Wrong answer, the card has still been updated"
                })
            }

        }
}

