import { db } from "./database.js"
import { collectionTable, flashCardTable, personnalFlashCardsTable, usersTable } from "./schema.js"
import bcrypt from "bcrypt"

async function seedIfEmpty() {
    const existing = await db.select().from(usersTable).limit(1)

    if (existing.length > 0) {
        console.log("[API] Base de donnees deja initialisee, seed ignore.")
        return
    }

    console.log("[API] Base de donnees vide, insertion des donnees initiales...")

    try {
        const seedUsers = [
            {
                email: "toto@gmail.com",
                name: "Toto",
                surname: "Titi",
                password: bcrypt.hashSync("motdepasse", 12),
                role: "ADMIN",
            },
            {
                email: "Admin@gmail.com",
                name: "Admin",
                surname: "Super",
                password: bcrypt.hashSync("motdepasse", 12),
                role: "USER",
            },
            {
                email: "Jean@gmail.com",
                name: "Jean",
                surname: "Beur",
                password: bcrypt.hashSync("motdepasse", 12),
                role: "USER",
            },
        ]
        const users = await db.insert(usersTable).values(seedUsers).returning()

        const seedCollections = [
            {
                ownerId: users[0].id,
                title: "Questions de Maths",
                description: "Révisez vos bases en mathématiques grâce à ces questions !",
                visibility: "public",
            },
            {
                ownerId: users[1].id,
                title: "Questions de Géographie",
                description: "Révisez vos bases en géographie grâce à ces questions !",
                visibility: "private",
            },
        ]
        const collections = await db.insert(collectionTable).values(seedCollections).returning()

        const seedFlashCards = [
            {
                rectoText: "25² ?",
                versoText: "625",
                collectionId: collections[0].id,
                ownerId: users[0].id,
            },
            {
                rectoText: "Racine carrée de 169 ?",
                versoText: "13",
                collectionId: collections[0].id,
                ownerId: users[0].id,
            },
            {
                rectoText: "Capitale de la France ?",
                versoText: "Paris",
                collectionId: collections[1].id,
                ownerId: users[1].id,
            },
            {
                rectoText: "Capitale du Maroc ?",
                versoText: "Rabat",
                collectionId: collections[1].id,
                ownerId: users[1].id,
            },
        ]
        const flashCards = await db.insert(flashCardTable).values(seedFlashCards).returning()

        const seedPersonnalFlashCards = [
            {
                level: 1,
                lastStudyDate: new Date("2025-10-12"),
                nextStudyDate: new Date("2025-11-12"),
                flashCardId: flashCards[0].id,
                userId: users[0].id,
            },
            {
                level: 1,
                lastStudyDate: new Date("2025-11-12"),
                nextStudyDate: new Date("2025-10-12"),
                flashCardId: flashCards[1].id,
                userId: users[0].id,
            },
            {
                level: 1,
                lastStudyDate: new Date("2025-10-12"),
                nextStudyDate: new Date("2025-10-12"),
                flashCardId: flashCards[2].id,
                userId: users[1].id,
            },
            {
                level: 1,
                lastStudyDate: new Date("2025-10-12"),
                nextStudyDate: new Date("2025-10-12"),
                flashCardId: flashCards[3].id,
                userId: users[1].id,
            },
        ]
        await db.insert(personnalFlashCardsTable).values(seedPersonnalFlashCards)

        console.log("[API] Seed termine avec succes.")
    } catch (error) {
        console.error("[API] Erreur pendant le seed :", error)
        process.exit(1)
    }
}

seedIfEmpty()
