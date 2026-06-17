import { db } from './database.js'
import { collectionTable, flashCardTable, personnalFlashCardsTable, usersTable } from './schema.js'
import bcrypt from "bcrypt"

const hash = (pwd) => bcrypt.hashSync(pwd, 10)

const daysFromNow = (n) => new Date(Date.now() + n * 86400000)
const daysAgo = (n) => new Date(Date.now() - n * 86400000)

async function seed() {
    try {
        console.log('Database seeding starting...')
        await db.delete(personnalFlashCardsTable)
        await db.delete(flashCardTable)
        await db.delete(collectionTable)
        await db.delete(usersTable)

        // ── UTILISATEURS ──────────────────────────────────────────
        const users = await db.insert(usersTable).values([
            {
                email: 'admin@flashcards.dev',
                name: 'Alice',
                surname: 'Dupont',
                password: hash('Admin1234!'),
                role: 'ADMIN'
            },
            {
                email: 'bob@flashcards.dev',
                name: 'Bob',
                surname: 'Martin',
                password: hash('motdepasse'),
                role: 'USER'
            },
            {
                email: 'clara@flashcards.dev',
                name: 'Clara',
                surname: 'Leroy',
                password: hash('motdepasse'),
                role: 'USER'
            },
            {
                email: 'david@flashcards.dev',
                name: 'David',
                surname: 'Bernard',
                password: hash('motdepasse'),
                role: 'USER'
            },
        ]).returning()

        const [alice, bob, clara, david] = users

        // ── COLLECTIONS ───────────────────────────────────────────
        const collections = await db.insert(collectionTable).values([
            {
                ownerId: alice.id,
                title: 'Mathématiques - Lycée',
                description: 'Formules et théorèmes essentiels du lycée.',
                visibility: 'public'
            },
            {
                ownerId: alice.id,
                title: 'Capitales du monde',
                description: 'Les capitales des pays du monde entier.',
                visibility: 'public'
            },
            {
                ownerId: bob.id,
                title: 'Vocabulaire anglais',
                description: 'Mots courants anglais-français pour enrichir son vocabulaire.',
                visibility: 'public'
            },
            {
                ownerId: bob.id,
                title: 'Histoire de France',
                description: 'Dates et événements clés de l\'histoire de France.',
                visibility: 'public'
            },
            {
                ownerId: clara.id,
                title: 'Développement Web',
                description: 'Concepts fondamentaux du développement web moderne.',
                visibility: 'public'
            },
            {
                ownerId: clara.id,
                title: 'Mes révisions perso',
                description: 'Collection privée de révisions personnelles.',
                visibility: 'private'
            },
            {
                ownerId: david.id,
                title: 'Sciences - Physique-Chimie',
                description: 'Formules et constantes de physique-chimie.',
                visibility: 'public'
            },
        ]).returning()

        const [maths, capitales, anglais, histoire, devweb, perso, sciences] = collections

        // ── FLASHCARDS ────────────────────────────────────────────
        const flashcards = await db.insert(flashCardTable).values([

            // Maths
            { rectoText: 'Formule de l\'aire d\'un cercle ?', versoText: 'A = π × r²', collectionId: maths.id, ownerId: alice.id },
            { rectoText: 'Formule du volume d\'une sphère ?', versoText: 'V = (4/3) × π × r³', collectionId: maths.id, ownerId: alice.id },
            { rectoText: 'Théorème de Pythagore ?', versoText: 'a² + b² = c² (avec c l\'hypoténuse)', collectionId: maths.id, ownerId: alice.id },
            { rectoText: 'Développement de (a + b)² ?', versoText: 'a² + 2ab + b²', collectionId: maths.id, ownerId: alice.id },
            { rectoText: 'Factorisation de a² - b² ?', versoText: '(a + b)(a - b)', collectionId: maths.id, ownerId: alice.id },
            { rectoText: 'Dérivée de sin(x) ?', versoText: 'cos(x)', collectionId: maths.id, ownerId: alice.id },
            { rectoText: 'Dérivée de eˣ ?', versoText: 'eˣ', collectionId: maths.id, ownerId: alice.id },
            { rectoText: 'Valeur de π arrondie à 4 décimales ?', versoText: '3.1416', collectionId: maths.id, ownerId: alice.id },

            // Capitales
            { rectoText: 'Capitale de l\'Allemagne ?', versoText: 'Berlin', collectionId: capitales.id, ownerId: alice.id },
            { rectoText: 'Capitale du Japon ?', versoText: 'Tokyo', collectionId: capitales.id, ownerId: alice.id },
            { rectoText: 'Capitale du Brésil ?', versoText: 'Brasília', collectionId: capitales.id, ownerId: alice.id },
            { rectoText: 'Capitale de l\'Australie ?', versoText: 'Canberra', collectionId: capitales.id, ownerId: alice.id },
            { rectoText: 'Capitale du Canada ?', versoText: 'Ottawa', collectionId: capitales.id, ownerId: alice.id },
            { rectoText: 'Capitale de l\'Argentine ?', versoText: 'Buenos Aires', collectionId: capitales.id, ownerId: alice.id },
            { rectoText: 'Capitale de l\'Inde ?', versoText: 'New Delhi', collectionId: capitales.id, ownerId: alice.id },

            // Anglais
            { rectoText: 'Traduction de "réussir" ?', versoText: 'To succeed', collectionId: anglais.id, ownerId: bob.id },
            { rectoText: 'Traduction de "connaissances" ?', versoText: 'Knowledge', collectionId: anglais.id, ownerId: bob.id },
            { rectoText: 'Traduction de "développement" ?', versoText: 'Development', collectionId: anglais.id, ownerId: bob.id },
            { rectoText: 'Traduction de "améliorer" ?', versoText: 'To improve', collectionId: anglais.id, ownerId: bob.id },
            { rectoText: 'Traduction de "environnement" ?', versoText: 'Environment', collectionId: anglais.id, ownerId: bob.id },
            { rectoText: 'Traduction de "entreprise" ?', versoText: 'Company / Business', collectionId: anglais.id, ownerId: bob.id },

            // Histoire
            { rectoText: 'Date de la Révolution française ?', versoText: '1789', collectionId: histoire.id, ownerId: bob.id },
            { rectoText: 'Date de la fin de la Seconde Guerre mondiale ?', versoText: '1945', collectionId: histoire.id, ownerId: bob.id },
            { rectoText: 'Date de la prise de la Bastille ?', versoText: '14 juillet 1789', collectionId: histoire.id, ownerId: bob.id },
            { rectoText: 'En quelle année Napoléon est-il devenu empereur ?', versoText: '1804', collectionId: histoire.id, ownerId: bob.id },
            { rectoText: 'Date de la création de la Ve République ?', versoText: '1958', collectionId: histoire.id, ownerId: bob.id },

            // Dev Web
            { rectoText: 'Que signifie HTTP ?', versoText: 'HyperText Transfer Protocol', collectionId: devweb.id, ownerId: clara.id },
            { rectoText: 'Que signifie REST ?', versoText: 'Representational State Transfer', collectionId: devweb.id, ownerId: clara.id },
            { rectoText: 'Code HTTP pour "Not Found" ?', versoText: '404', collectionId: devweb.id, ownerId: clara.id },
            { rectoText: 'Code HTTP pour "Created" ?', versoText: '201', collectionId: devweb.id, ownerId: clara.id },
            { rectoText: 'Code HTTP pour "Unauthorized" ?', versoText: '401', collectionId: devweb.id, ownerId: clara.id },
            { rectoText: 'Que signifie JWT ?', versoText: 'JSON Web Token', collectionId: devweb.id, ownerId: clara.id },
            { rectoText: 'Que signifie ORM ?', versoText: 'Object-Relational Mapping', collectionId: devweb.id, ownerId: clara.id },
            { rectoText: 'Que signifie CRUD ?', versoText: 'Create, Read, Update, Delete', collectionId: devweb.id, ownerId: clara.id },

            // Sciences
            { rectoText: 'Formule de la vitesse ?', versoText: 'v = d / t', collectionId: sciences.id, ownerId: david.id },
            { rectoText: 'Formule de l\'énergie cinétique ?', versoText: 'Ec = (1/2) × m × v²', collectionId: sciences.id, ownerId: david.id },
            { rectoText: 'Loi d\'Ohm ?', versoText: 'U = R × I', collectionId: sciences.id, ownerId: david.id },
            { rectoText: 'Valeur de la constante de gravité g ?', versoText: '9.81 m/s²', collectionId: sciences.id, ownerId: david.id },
            { rectoText: 'Formule chimique de l\'eau ?', versoText: 'H₂O', collectionId: sciences.id, ownerId: david.id },
            { rectoText: 'Formule chimique du dioxyde de carbone ?', versoText: 'CO₂', collectionId: sciences.id, ownerId: david.id },

        ]).returning()

        // ── RÉVISIONS PERSONNELLES ────────────────────────────────
        // Alice révise les flashcards de maths avec différents niveaux
        const revisions = []

        const mathCards = flashcards.slice(0, 8)
        const levels = [5, 4, 3, 2, 1, 3, 2, 4]
        mathCards.forEach((card, i) => {
            revisions.push({
                level: levels[i],
                lastStudyDate: daysAgo(levels[i] * 2),
                nextStudyDate: daysFromNow(Math.pow(2, levels[i])),
                flashCardId: card.id,
                userId: alice.id
            })
        })

        // Bob révise les capitales et l'histoire
        const capitalesCards = flashcards.slice(8, 15)
        capitalesCards.forEach((card, i) => {
            revisions.push({
                level: (i % 3) + 1,
                lastStudyDate: daysAgo(3),
                nextStudyDate: daysFromNow(i + 1),
                flashCardId: card.id,
                userId: bob.id
            })
        })

        // Clara révise le dev web
        const devCards = flashcards.slice(26, 34)
        devCards.forEach((card, i) => {
            revisions.push({
                level: i < 4 ? 2 : 1,
                lastStudyDate: daysAgo(2),
                nextStudyDate: i < 4 ? daysFromNow(4) : daysAgo(1),
                flashCardId: card.id,
                userId: clara.id
            })
        })

        await db.insert(personnalFlashCardsTable).values(revisions)

        console.log(`Seed terminé :`)
        console.log(`  - ${users.length} utilisateurs`)
        console.log(`  - ${collections.length} collections`)
        console.log(`  - ${flashcards.length} flashcards`)
        console.log(`  - ${revisions.length} révisions personnelles`)

    } catch (error) {
        console.error('Erreur pendant le seed :', error)
        process.exit(1)
    }
}

seed()
