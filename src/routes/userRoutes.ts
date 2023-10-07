import express from 'express'
import { signUp, auth, confirm, forgotPassword, comprobeToken, newPassword, profile } from '../controllers/userController'
import { checkOut } from '../middleware/checkOut'

const router = express.Router()

router.post('/', signUp)
router.post('/auth', auth)
router.get('/confirm/:token', confirm)
router.post('/forgot-password', forgotPassword)
router.route('/forgot-password/:token')
  .get(comprobeToken)
  .post(newPassword)

router.get('/profile', checkOut, profile)

export default router