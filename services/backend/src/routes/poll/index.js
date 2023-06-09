import { Router } from 'express'
import { authenticate } from '../../middleware/index.js'
import list from './list.js'
import create from './create.js'

const router = Router()

router.route('/').get(authenticate, list)
router.route('/').post(authenticate, create)

export default router
