import { Router } from 'express'
import { authenticate } from '../../middleware/index.js'
import list from './list.js'
import create from './create.js'
import remove from './remove.js'
import update from './update.js'

const router = Router()

router.route('/').get(authenticate, list)
router.route('/').post(authenticate, create)
router.route('/').delete(authenticate, remove)
router.route('/').put(authenticate, update)

export default router
