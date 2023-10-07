import jwt from 'jsonwebtoken'

/**
 * generate an Id
 */
export const generateId = () => {
  const random = Math.random().toString(32).substring(2)
  const date = Date.now().toString(32)
  return random + date
}

/**
 * generate a jwt
 */
export const generateJwt = (id: string) => {
  // lo que va a colocar en el token y el secreto, y la configuracion
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  }) 
}