import { z } from 'zod'

export const answer = z.object({
    answer: z.string().min(1)
})