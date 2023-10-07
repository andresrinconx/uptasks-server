import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

export interface ReqInterface extends Request {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
}

interface DecodedToken {
  id: string
}

export const checkOut = async (req: ReqInterface, res: Response, next: NextFunction) => {
  let token: string
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken // decodificar token

      // se le agrega la propiedad user al request para usarlo en el siguiente middleware (el controller)
      req.user = await User.findById(decoded.id).select('-password -token -confirmed -createdAt -updatedAt -__v') // quitar propiedades
      return next()
    } catch (error) {
      return res.status(404).json({ msg: 'There was an error' })
    }
  }
  
  if (!token) {
    const error = new Error('Invalid token')
    return res.status(400).json({ msg: error.message })
  }

  next()
}