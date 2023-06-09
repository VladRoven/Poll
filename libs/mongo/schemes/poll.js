import { ObjectId, mongoose } from '../connection.js'

const { Schema } = mongoose
const poll = new Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
      require: true,
      index: true
    },
    data: {
      type: String,
      require: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Poll', poll)
