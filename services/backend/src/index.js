import '@poll/env'
import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import api from './api.js'
import { mongoose } from '@poll/mongo'

await Promise.all([await mongoose.connect()])
const { PORT, API_PREFIX, HOST } = process.env
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(API_PREFIX, api)
app.use((req, res, next) =>
  res.status(404).json({
    message: 'Unknown endpoint',
    status: 404,
    type: 'NotFoundError',
  })
)
app.use((err, req, res, next) =>
  res.status(err.statusCode || 502).json({
    message: err.message,
    status: err.statusCode || err.code || 502,
    type: err.body && err.body.code ? err.body.code : 'Error',
  })
)

const httpServer = http.createServer(app)
httpServer.listen(PORT, HOST, () => {
  console.log(`[SERVER] 🚀 Started on http://${HOST}:${PORT}`)
})
