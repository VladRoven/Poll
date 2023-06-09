import { Router } from 'express'
import { authenticate } from '../../middleware/index.js'
import get from './get.js'
import update from './update.js'
import remove from './remove.js'

const router = Router()

router.route('/').get(authenticate, get)
router.route('/').put(authenticate, update)
router.route('/').delete(authenticate, remove)

export default router
