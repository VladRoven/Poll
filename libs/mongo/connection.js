import Mongoose from 'mongoose'

const { MONGO_URI } = process.env
const options = {
  useNewUrlParser: true,
  autoIndex: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 25000,
  useUnifiedTopology: true,
  minPoolSize: 10
}
const db = Mongoose.connection

db.on('connected', () => {
  console.log(`[MONGO] Connected to ${MONGO_URI}`)
})
db.on('disconnect', () => {
  console.log(`[MONGO] Disconnected from ${MONGO_URI}`)
})
db.on('reconnected', () => {
  console.log(`[MONGO] Reconnected to ${MONGO_URI}`)
})
db.on('reconnectFailed', () => {
  console.log(`[MONGO] Reconnect failed ${MONGO_URI}`)
})
db.on('close', () => {
  console.log(`[MONGO] Connection closed ${MONGO_URI}`)
})

export const mongoose = Mongoose
export const { ObjectId } = Mongoose.Types
export default {
  connect: async () => await mongoose.connect(MONGO_URI, options),
  disconnect: async () => await db.close(),
  mongoose: Mongoose
}
