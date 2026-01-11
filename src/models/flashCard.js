import { z } from 'zod'

export const createFlashCardSchema = z.object({

    
    rectoText : z.string().min(1,'You need to add the question of the flashCard').max(300, 'The question is too long !'),
    versoText : z.string().min(1,'You need to add the answer of the flashCard').max(300, 'The answer is too long !'),
    
    rectoUrl : z.string(),
    versoUrl : z.string(),
    
    collectionId: z.string().min(1,'The flashcard needs to belong to a collection !'),
})

export const updateFlashCardSchema = z.object({
    rectoText: z.string().min(1).max(300).optional(),
    versoText: z.string().min(1).max(300).optional(),
    rectoUrl: z.string().optional(),
    versoUrl: z.string().optional(),
})
