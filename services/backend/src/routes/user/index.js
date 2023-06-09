import { Router } from 'express'
import { authenticate } from '../../middleware/index.js'
import get from './get.js'
import update from './update.js'
import remove from './remove.js'
import resetPass from './resetPass.js'

const router = Router()

router.route('/').get(authenticate, get)
router.route('/').put(authenticate, update)
router.route('/').delete(authenticate, remove)
router.route('/reset-pass').put(resetPass)

export default router
