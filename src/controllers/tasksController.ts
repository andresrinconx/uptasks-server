import { Request, Response } from 'express'
import Tasks from '../models/Tasks'
import Project from '../models/Project'

export interface ReqInterface extends Request {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
}

/**
 * Add a new task.
 */
export const addTask = async (req: ReqInterface, res: Response) => {
  const { project } = req.body

  const existProject = await Project.findById(project)

  if (!existProject) {
    const error = new Error('The project doesn\'t exist')
    return res.status(404).json({ msg: error.message })
  }

  if (existProject.creator.toString() !== req.user._id.toString()) {
    const error = new Error('You can\'t add a task to this project')
    return res.status(404).json({ msg: error.message })
  }

  try {
    const savedTask = await Tasks.create(req.body)
    res.json(savedTask) 
  } catch (error) {
    console.log(error)
  }
}

/**
 * Get task by id.
 */
export const getTask = async (req: ReqInterface, res: Response) => {
  const { id } = req.params

  const task = await Tasks.findById(id).populate('project') // carga el documento relacionado con el nombre de la 'propiedad' que se le pase, en este caso project
  if (!task) {
    const error = new Error('Not found')
    return res.status(404).json({ msg: error.message })
  }

  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((task.project as any).creator.toString() !== req.user._id.toString()) {
    const error = new Error('Invalid action')
    return res.status(403).json({ msg: error.message })
  }

  res.json(task)
}

/**
 * Update a task.
 */
export const updateTask = async (req: ReqInterface, res: Response) => {
  const { id } = req.params

  const task = await Tasks.findById(id).populate('project') // carga el documento relacionado con el nombre de la 'propiedad' que se le pase, en este caso project
  if (!task) {
    const error = new Error('Not found')
    return res.status(404).json({ msg: error.message })
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((task.project as any).creator.toString() !== req.user._id.toString()) {
    const error = new Error('Invalid action')
    return res.status(403).json({ msg: error.message })
  }

  // Update the task
  task.name = req.body.name || task.name
  task.description = req.body.description || task.description
  task.priority = req.body.priority || task.priority
  task.date = req.body.date || task.date

  try {
    const savedTask = await task.save()
    res.json(savedTask)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Delete a task.
 */
export const deleteTask = async (req: ReqInterface, res: Response) => {
  const { id } = req.params

  const task = await Tasks.findById(id).populate('project') // carga el documento relacionado con el nombre de la 'propiedad' que se le pase, en este caso project
  if (!task) {
    const error = new Error('Not found')
    return res.status(404).json({ msg: error.message })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((task.project as any).creator.toString() !== req.user._id.toString()) {
    const error = new Error('Invalid action')
    return res.status(403).json({ msg: error.message })
  }

  // Delete task
  try {
    await task.deleteOne()
    res.json({ msg: 'Task Deleted' })
  } catch (error) {
    console.log(error)
  }
}