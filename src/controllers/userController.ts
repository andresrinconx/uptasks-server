import { Request, Response } from 'express'
import User, { IUser } from '../models/User'
import { generateId, generateJwt } from '../utils/helpers'

export interface ReqInterface extends Request {
  user: any
}

/**
 * Create a new user.
 */
export const signUp = async (req: Request, res: Response) => {
  const { email } = req.body
  const userExists = await User.findOne({ email })

  if (userExists) {
    const error = new Error('User already exists')
    return res.status(400).json({ msg: error.message })
  }

  try {
    const user = new User(req.body)
    user.token = generateId()
    const savedUser = await user.save()
    res.json({ savedUser })
  } catch (error) {
    res.status(400).json({ msg: error })
  }
}

/**
 * Authenticate a user.
 */
export const auth = async (req: Request, res: Response) => {
  const { email, password } = req.body
  
  // user exists
  const user = await User.findOne({ email }) as IUser
  if (!user) {
    const error = new Error('User not found')
    return res.status(404).json({ msg: error.message })
  }

  // comprobe confirm
  if (!user.confirmed) {
    const error = new Error('Your account is not confirmet yet')
    return res.status(403).json({ msg: error.message })
  }

  // comprobe password
  if (await user.comparePassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJwt(user._id)
    })
  } else {
    const error = new Error('Incorrect password')
    return res.status(403).json({ msg: error.message })
  }
}

/**
 * Confirm a user.
 */
export const confirm = async (req: Request, res: Response) => {
  const { token } = req.params
  const userConfirm = await User.findOne({ token })
  if (!userConfirm) {
    const error = new Error('Invalid token')
    return res.status(400).json({ msg: error.message })
  }

  try {
    userConfirm.confirmed = true
    userConfirm.token = ''
    await userConfirm.save()
    res.json({ msg: 'User confirmed successfuly' })
  }
   catch (error) {
    res.status(400).json({ msg: error })
  }
}

/**
 * Forgot password.
 */
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body

  // Comprobe user exists
  const user = await User.findOne({ email })
  if (!user) {
    const error = new Error('User not found')
    return res.status(400).json({ msg: error.message })
  }

  try {
    user.token = generateId()
    await user.save()
    res.json({ msg: 'Email sent' })
  } catch (error) {
    res.status(400).json({ msg: error })
  }
}

/**
 * Comprobe token when password has been forget.
 */
export const comprobeToken = async (req: Request, res: Response) => {
  const { token } = req.params

  const tokenValid = await User.findOne({ token })
  if (!tokenValid) {
    const error = new Error('Invalid token')
    return res.status(400).json({ msg: error.message })
  }

  res.json({ msg: 'Token valid' })
}

/**
 * Create a new password.
 */
export const newPassword = async (req: Request, res: Response) => {
  const { token } = req.params
  const { password } = req.body

  const user = await User.findOne({ token })
  if (!user) {
    const error = new Error('Invalid token')
    return res.status(400).json({ msg: error.message })
  }

  user.password = password
  user.token = ''

  try {
    await user.save()
    res.json({ msg: 'Password changed' })
  } catch (error) {
    res.status(400).json({ msg: error })
  }
}

/**
 * Get user profile.
 */
export const profile = async (req: ReqInterface, res: Response) => {
  const { user } = req
  res.json(user)
}