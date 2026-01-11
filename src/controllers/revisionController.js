import { db } from "../db/database.js"
import { personnalFlashCardsTable, flashCardTable } from "../db/schema.js"
import { eq, lte } from "drizzle-orm"

export const getFlashcardsToReview = async (req, res) => {
    try {
        const userId = req.user.userId
        const now = new Date()

        const flashcards = await db
            .select({
                id: personnalFlashCardsTable.id,
                level: personnalFlashCardsTable.level,
                nextStudyDate: personnalFlashCardsTable.nextStudyDate,
                flashcard: flashCardTable
            })
            .from(personnalFlashCardsTable)
            .innerJoin(
                flashCardTable,
                eq(personnalFlashCardsTable.flashCardId, flashCardTable.id)
            )
            .where(
                eq(personnalFlashCardsTable.userId, userId),
                lte(personnalFlashCardsTable.nextStudyDate, now)
            )

        res.status(200).json(flashcards)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to fetch flashcards to review" })
    }
}
const LEVEL_DELAYS = {
    1: 1,
    2: 2,
    3: 4,
    4: 8,
    5: 16
}

export const reviewFlashcard = async (req, res) => {
    try {
        const userId = req.user.userId
        const { flashCardId } = req.params

        let [progress] = await db
            .select()
            .from(personnalFlashCardsTable)
            .where(
                eq(personnalFlashCardsTable.flashCardId, flashCardId),
                eq(personnalFlashCardsTable.userId, userId)
            )
            .limit(1)

        // 📌 Première révision → création
        if (!progress) {
            progress = {
                level: 1
            }

            await db.insert(personnalFlashCardsTable).values({
                userId,
                flashCardId,
                level: 1,
                lastStudyDate: new Date(),
                nextStudyDate: new Date(Date.now() + 86400000)
            })

            return res.status(200).json({
                message: "Flashcard reviewed (first time)",
                level: 1
            })
        }

        const newLevel = Math.min(progress.level + 1, 5)
        const delayDays = LEVEL_DELAYS[newLevel]
        const nextDate = new Date(Date.now() + delayDays * 86400000)

        await db
            .update(personnalFlashCardsTable)
            .set({
                level: newLevel,
                lastStudyDate: new Date(),
                nextStudyDate: nextDate
            })
            .where(eq(personnalFlashCardsTable.id, progress.id))

        res.status(200).json({
            message: "Flashcard reviewed",
            level: newLevel,
            nextStudyDate: nextDate
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to review flashcard" })
    }
}
