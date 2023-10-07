import express from 'express'
import { addTask, getTask, updateTask, deleteTask } from '../controllers/tasksController'
import { checkOut } from '../middleware/checkOut'

const router = express.Router()

router.post('/', checkOut, addTask)
router.route('/:id')
  .get(checkOut, getTask)
  .put(checkOut, updateTask)
  .delete(checkOut, deleteTask)

// router.post('/state/:id', checkOut, changeState)

export default router