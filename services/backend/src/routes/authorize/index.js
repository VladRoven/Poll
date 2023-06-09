import { Router } from 'express'
import signin from './signin.js'
import signup from './signup.js'
import refresh from './refresh.js'
import logout from './logout.js'
import { authenticate } from '../../middleware/index.js'

const router = Router()

router.route('/signin').post(signin)
router.route('/signup').post(signup)
router.route('/refresh').put(refresh)
router.route('/logout').put(authenticate, logout)

export default router
