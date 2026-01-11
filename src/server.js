import express from 'express'
import userRoutes from './routers/usersRoutes.js'
import logger from './middlewares/logger.js'
import authRouter from './routers/authRouter.js'
import flashCardRouter from './routers/flashCardRoutes.js'
import collectionRouter from './routers/collectionRoutes.js'
import adminUsersRouter from './routers/adminUsersRouter.js'

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(logger)
app.use('/users', userRoutes)
app.use('/auth', authRouter)
app.use('/flashcards', flashCardRouter)
app.use('/collections', collectionRouter)
app.use('/admin/users', adminUsersRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
