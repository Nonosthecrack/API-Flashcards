import { db } from "../db/database.js"
import { flashCardTable, personnalFlashCardsTable } from "../db/schema.js"
import { and, eq } from "drizzle-orm"

export const studyFlashCard = async (req, res) => {
    try {
        const { id } = req.params
        const { answer } = req.body

        const [progress] = await db
            .select()
            .from(personnalFlashCardsTable)
            .where(
                and(
                    eq(personnalFlashCardsTable.id, id),
                    eq(personnalFlashCardsTable.userId, req.user.userId)
                )
            )
            .limit(1)

        if (!progress) {
            return res.status(404).json({ error: "Flashcard not found in your study list" })
        }

        const [flashcard] = await db
            .select()
            .from(flashCardTable)
            .where(eq(flashCardTable.id, progress.flashCardId))
            .limit(1)

        if (!flashcard) {
            return res.status(404).json({ error: "Flashcard not found" })
        }

        const newLevel = Math.min(progress.level + 1, 5)
        const delayDays = Math.pow(2, newLevel)
        const nextDate = new Date(Date.now() + delayDays * 86400000)

        await db
            .update(personnalFlashCardsTable)
            .set({
                level: newLevel,
                lastStudyDate: new Date(),
                nextStudyDate: nextDate,
            })
            .where(eq(personnalFlashCardsTable.id, id))

        const isCorrect =
            flashcard.versoText.toLowerCase().trim() === answer.toLowerCase().trim()

        return res.status(200).json({
            correct: isCorrect,
            message: isCorrect
                ? "Good answer, the card has been updated"
                : "Wrong answer, the card has still been updated",
            correctAnswer: flashcard.versoText,
            level: newLevel,
            nextStudyDate: nextDate,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to study flashcard" })
    }
}
