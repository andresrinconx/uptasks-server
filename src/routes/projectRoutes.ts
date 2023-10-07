import express from 'express'
import { getProjects, createProject, getProject, updateProject, deleteProject, addGuest, removeGuest, searchGuest } from '../controllers/projectController'
import { checkOut } from '../middleware/checkOut'

const router = express.Router()

router.route('/')
  .get(checkOut, getProjects)
  .post(checkOut, createProject)

router.route('/:id')
  .get(checkOut, getProject)
  .put(checkOut, updateProject)
  .delete(checkOut, deleteProject)

router.post('/search-guset', checkOut, searchGuest)
router.post('/add-guest/:id', checkOut, addGuest)
router.post('/remove-guest/:id', checkOut, removeGuest)

export default router