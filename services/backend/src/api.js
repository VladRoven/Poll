import express from 'express'
import cors from './cors.js'
import * as endpoint from './routes/index.js'

const { Router } = express
const router = Router()

router.use(cors)
router.use('/user', endpoint.user)
router.use('/poll', endpoint.poll)
router.use('/authorize', endpoint.authorize)

export default router
