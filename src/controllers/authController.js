import { request, response } from "express";
import { db } from "../db/database.js";
import { usersTable } from "../db/schema.js";
import bcrypt from 'bcrypt';
import  jwt  from "jsonwebtoken";
import { eq } from "drizzle-orm";


export const register = async (req, res) => {
    try {
        const { email, name, surname, password } = req.body

        const hashedPassword = await bcrypt.hash(password, 12)

        const [newUser] = await db.insert(usersTable).values({
            email,
            name,
            surname,
            password: hashedPassword,
        }).returning({
            email: usersTable.email,
            name: usersTable.name,
            surname: usersTable.surname,
            id: usersTable.id
        })

        const token = jwt.sign(
            { userId: newUser.id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
        

        res.status(201).json({
            message: 'user created',
            userData: newUser,
            token,           
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Register failed' })
    }
}



export const login = async (req, res) => {
    try {
        const { email, password} = req.body
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1)

        if (!user) {
            return res.status(401).json({error: 'Invalid email or password'})
        }

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return res.status(401).json({error: 'Invalid email or password'})
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
        

        res.status(201).json({
            message: 'login succesful',
            userData: user,
            token,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'login failed' })
    }
}

export const me = async (req, res) => {
    try {
        const [user] = await db
            .select({
                id: usersTable.id,
                email: usersTable.email,
                name: usersTable.name,
                surname: usersTable.surname,
                role: usersTable.role,
            })
            .from(usersTable)
            .where(eq(usersTable.id, req.user.userId))
            .limit(1)
        res.status(200).json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch user' })
    }
}
