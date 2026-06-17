import {collectionTable} from "../db/schema.js"
import {db} from "../db/database.js"
import {eq, or, like, and, sql} from 'drizzle-orm'

export const getAllCollection = async (req, res) => {
    try {
        const { page, limit, offset } = req.pagination

        const isAdmin = req.user.role === 'ADMIN'

        const whereClause = isAdmin
            ? undefined
            : or(
                eq(collectionTable.visibility, 'public'),
                eq(collectionTable.ownerId, req.user.userId)
            )

        const fields = { title: collectionTable.title, description: collectionTable.description }

        const baseQuery = db.select(fields).from(collectionTable)
        const countQuery = db.select({ count: sql`count(*)` }).from(collectionTable)

        const [collections, [{ count }]] = await Promise.all([
            whereClause
                ? baseQuery.where(whereClause).limit(limit).offset(offset)
                : baseQuery.limit(limit).offset(offset),
            whereClause
                ? countQuery.where(whereClause)
                : countQuery,
        ])

        const total = Number(count)

        res.status(200).json({
            data: collections,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch collections' })
    }
}

export const createCollection = async(req, res) => {
    try {
        const { title, description, visibility } = req.body
        const userId = req.user.userId

        await db.insert(collectionTable).values({ title, description, visibility, ownerId: userId }).returning()

        res.status(201).send({ message: 'Collection created' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create Collection' })
    }
}

export const deleteCollection = async (req, res) => {
    const { id } = req.params
    const userId = req.user.userId

    try {
        const [collection] = await db
            .select()
            .from(collectionTable)
            .where(eq(collectionTable.id, id))
            .limit(1)

        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' })
        }

        if (collection.ownerId !== userId) {
            return res.status(403).json({ error: "You are not allowed to delete this Collection" })
        }

        await db.delete(collectionTable).where(eq(collectionTable.id, id))

        res.status(200).json({ message: `Collection ${id} deleted successfully` })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to delete Collection' })
    }
}

export const getCollectionById = async (req, res) => {
    try {
        const { id } = req.params

        const [collection] = await db
            .select()
            .from(collectionTable)
            .where(eq(collectionTable.id, id))
            .limit(1)

        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' })
        }

        const isOwner = collection.ownerId === req.user.userId
        const isAdmin = req.user.role === 'ADMIN'

        if (collection.visibility === 'private' && !isOwner && !isAdmin) {
            return res.status(403).json({ error: 'Access denied' })
        }

        res.status(200).json(collection)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch collection' })
    }
}

export const getMyCollections = async (req, res) => {
    try {
        const collections = await db
            .select()
            .from(collectionTable)
            .where(eq(collectionTable.ownerId, req.user.userId))

        res.status(200).json(collections)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch your collections' })
    }
}

export const searchPublicCollections = async (req, res) => {
    try {
        const { q } = req.query

        if (!q) {
            return res.status(400).json({ error: 'Query parameter q is required' })
        }

        const collections = await db
            .select()
            .from(collectionTable)
            .where(
                and(
                    eq(collectionTable.visibility, 'public'),
                    like(collectionTable.title, `%${q}%`)
                )
            )

        res.status(200).json(collections)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Search failed' })
    }
}

export const updateCollection = async (req, res) => {
    try {
        const { id } = req.params

        const [collection] = await db
            .select()
            .from(collectionTable)
            .where(eq(collectionTable.id, id))
            .limit(1)

        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' })
        }

        if (collection.ownerId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' })
        }

        await db.update(collectionTable).set(req.body).where(eq(collectionTable.id, id))

        res.status(200).json({ message: 'Collection updated successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to update collection' })
    }
}
