import express from 'express'
import dotenv from 'dotenv'
import connectDB from './src/config/db'
import userRoutes from './src/routes/userRoutes'
import projectRoutes from './src/routes/projectRoutes'
import tasksRoutes from './src/routes/tasksRoutes'

const app = express()
app.use(express.json())
dotenv.config()
connectDB()

// routing
app.use('/api/users', userRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', tasksRoutes)

const port = process.env.PORT || 4000
app.listen(port, () => {
	console.log(`Working on port ${port}`)
})