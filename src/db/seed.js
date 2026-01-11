import {db} from './database.js'

import { collectionTable, flashCardTable, personnalFlashCardsTable, usersTable } from './schema.js'

import bcrypt from "bcrypt"

async function seed(){

    try {
        console.log('Database seeding starting...')
        await db.delete(personnalFlashCardsTable)  
        await db.delete(flashCardTable)             
        await db.delete(collectionTable)           
        await db.delete(usersTable)

		const seedUsers = [
			{
				email:'toto@gmail.com',
				name:'Toto',
                surname:'Titi',
				password: bcrypt.hashSync('motdepasse', 12),
                role: 'ADMIN'
			},

			{
				email:'Admin@gmail.com',
				name:'Admin',
                surname:'Super',
				password: bcrypt.hashSync('motdepasse', 12),
                role: 'USER'
			},

            {
				email:'Jean@gmail.com',
				name:'Jean',
                surname:'Beur',
				password: bcrypt.hashSync('motdepasse', 12),
                role: 'USER'
			},
		]
		const users = await db.insert(usersTable).values(seedUsers).returning() //On récupère les id des users

        const seedCollections = [

            {
                ownerId:users[0].id,
                title:'Questions de Maths',
                description:'Révisez vos bases en mathématiques grâce à ces questions !',
                visibility : 'public'
            },

            {
                ownerId:users[1].id,
                title:'Questions de Géographie',
                description:'Révisez vos bases en géographie grâce à ces questions !',
                visibility : 'private'
            }
        ]
        const collections = await db.insert(collectionTable).values(seedCollections).returning()

        const seedFlashCards = [

            {
                rectoText:'25² ?',
                versoText:'625',
                collectionId: collections[0].id,
                ownerId: users[0].id
            },

            {
                rectoText:'Racine carrée de 169 ?',
                versoText:'13',
                collectionId: collections[0].id,
                ownerId: users[0].id
            },

            {
                rectoText:'Capitale de la France ?',
                versoText:'Paris',
                collectionId: collections[1].id,
                ownerId: users[1].id
            },

            {
                rectoText:'Capitale du Maroc ?',
                versoText:'Rabat',
                collectionId: collections[1].id,
                ownerId: users[1].id
            },
        ]
        const FlashCards = await db.insert(flashCardTable).values(seedFlashCards).returning()
        
        const seedPersonnalFlashCards = [
            //Attention c'est mois/jour/année
            {
                level: 1,
                lastStudyDate: new Date('10-12-2025')  ,
                nextStudyDate:new Date('11-12-2025'),
                flashCardId: FlashCards[0].id,
                userId: users[0].id
            }, 

            {
                level: 1,
                lastStudyDate:new Date('11-12-2025'),
                nextStudyDate:new Date('10-12-2025'),
                flashCardId: FlashCards[1].id,
                userId: users[0].id
            },
            
            {
                level: 1,
                lastStudyDate:new Date('10-12-2025'),
                nextStudyDate:new Date('10-12-2025'),
                flashCardId: FlashCards[2].id,
                userId: users[1].id
            },
            
            {
                level: 1,
                lastStudyDate:new Date('10-12-2025'),
                nextStudyDate:new Date('10-12-2025'),
                flashCardId: FlashCards[3].id,
                userId: users[1].id
            },
        ]
        await db.insert(personnalFlashCardsTable).values(seedPersonnalFlashCards)
    }

    catch (error) {
        console.log('Error while seeding the database', error)
    }
}

seed()