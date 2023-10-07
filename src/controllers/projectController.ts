import { Request, Response } from 'express'
import Project from '../models/Project'
import User from '../models/User'
import Tasks from '../models/Tasks'

export interface ReqInterface extends Request {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
}

/**
 * Get projects.
 */
export const getProjects = async (req: ReqInterface, res: Response) => {
  const projects = await Project.find({
    '$or': [
      {guests: { $in: req.user }},
      {creator: { $in: req.user }},
    ]
  }).select('-tasks')
  
  res.json(projects)
}

/**
 * Create a new project.
 */
export const createProject = async (req: ReqInterface, res: Response) => {
  const project = new Project(req.body)
  project.creator = req.user._id

  try {
    const savedProject = await project.save()
    res.json({ savedProject })
  } catch (error) {
    console.log(error)
  }
}

/**
 * Get a project.
 */
export const getProject = async (req: ReqInterface, res: Response) => {
  const { id } = req.params
  const project = await Project.findById(id)
  
  if (!project) {
    const error = new Error('Not found')
    return res.status(404).json({ msg: error.message })
  }

  if (
    project.creator.toString() !== req.user._id.toString() && 
    !project.guests.some(guest => guest._id.toString() === req.user._id.toString())
  ) {
    const error = new Error('Invalid action')
    return res.status(401).json({ msg: error.message })
  }

  // Get project tasks
  const tasks = await Tasks.find()
    .where('project')
    .equals(project._id)

  res.json({ project, tasks })
}

/**
 * Update a project.
 */
export const updateProject = async (req: ReqInterface, res: Response) => {
  const { id } = req.params
  const project = await Project.findById(id)

  if (!project) {
    const error = new Error('Not found')
    return res.status(404).json({ msg: error.message })
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Invalid action')
    return res.status(401).json({ msg: error.message })
  }

  project.name = req.body.name || project.name
  project.description = req.body.description || project.description
  project.date = req.body.date || project.date
  project.customer = req.body.customer || project.customer
  
  try {
    const savedProject = await project.save()
    res.json(savedProject)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Delete a project.
 */
export const deleteProject = async (req: ReqInterface, res: Response) => {
  const { id } = req.params
  const project = await Project.findById(id)

  if (!project) {
    const error = new Error('Not found')
    return res.status(404).json({ msg: error.message })
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Invalid action')
    return res.status(401).json({ msg: error.message })
  }

  try {
    await project.deleteOne()
    res.json({ msg: 'Project deleted' })
  } catch (error) {
    console.log(error)
  }
}

/**
 * Search a guest.
 */
export const searchGuest = async (req: Request, res: Response) => {
  const { email } = req.body
  const user = await User.findOne({ email }).select('-confirmed -password -token -createdAt -updatedAt -__v')

  if (!user) {
    const error = new Error('User not found')
    return res.status(404).json({ msg: error.message })
  }

  res.json(user)
}

/**
 * Add a guest to a project.
 */
export const addGuest = async (req: ReqInterface, res: Response) => {
  const project = await Project.findById(req.params.id)

  if (!project) {
    const error = new Error('Not found')
    return res.status(404).json({ msg: error.message })
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Invalid action')
    return res.status(401).json({ msg: error.message })
  }

  const { email } = req.body
  const user = await User.findOne({ email }).select('-confirmed -password -token -createdAt -updatedAt -__v')

  if (!user) {
    const error = new Error('User not found')
    return res.status(404).json({ msg: error.message })
  }

  // The colaborator isn't the admin
  if (project.creator.toString() === user._id.toString()) {
    const error = new Error('The creator can\'t be a colaborator')
    return res.status(404).json({ msg: error.message })
  }

  // isn't added
  if (project.guests.includes(user._id)) {
    const error = new Error('The user is on the project')
    return res.status(400).json({ msg: error.message })
  }

  // It's OK
  project.guests.push(user._id)
  await project.save()
  res.json({ msg: 'Guest added' })
}

/**
 * Remove a guest from a project.
 */
export const removeGuest = async (req: ReqInterface, res: Response) => {
  const project = await Project.findById(req.params.id)

  if (!project) {
    const error = new Error('Not found')
    return res.status(404).json({ msg: error.message })
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Invalid action')
    return res.status(401).json({ msg: error.message })
  }

  // Remove guest detected
  project.guests = project.guests.filter(guest => guest.toString() !== req.body.id)
  await project.save()
  res.json({ msg: 'Guest removed' })
}