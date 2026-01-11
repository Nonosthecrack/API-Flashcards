import { z } from 'zod'

const visibilityEnum = z.enum(['public', 'private'])

export const createCollectionSchema = z.object({

    title: z.string().min(5,'The title of your collection must be at least 5 characters long').max(255, 'The title of your collection is too long !'),
    description: z.string().min(5,'The description of your collection must be at least 5 characters long').max(255, 'The description of your collection is too long !'),
    visibility: visibilityEnum
})

export const updateCollectionSchema = z.object({
    title: z.string().min(5).max(255).optional(),
    description: z.string().min(5).max(255).optional(),
    visibility: visibilityEnum.optional()
})