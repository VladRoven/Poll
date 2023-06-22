import { ObjectId, mongoose } from '../connection.js'

const { Schema } = mongoose
const respondent = new Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    require: true,
    index: true,
  },
  answers: {
    type: Object,
    require: true,
  },
})
const poll = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    user: {
      type: ObjectId,
      ref: 'User',
      require: true,
      index: true,
    },
    status: {
      type: String,
      default: 'dev',
      require: true,
      index: true,
    },
    dateOpen: {
      type: Date,
      default: null,
    },
    dateClose: {
      type: Date,
      default: null,
    },
    respondents: [respondent],
    questions: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

class Poll {
  static dumpRespondent(poll, userId) {
    if (poll.status === 'close') {
      return {
        id: poll._id,
        status: poll.status,
      }
    }
    return {
      id: poll._id,
      title: poll.title,
      status: poll.status,
      respondent: poll.respondents.length
        ? poll.respondents.some(
            ({ user }) => user._id.toString() === userId.toString()
          )
        : false,
      questions: poll.questions ? JSON.parse(poll.questions) : [],
    }
  }
  static dumpCreator(poll) {
    return {
      id: poll._id,
      title: poll.title,
      user: poll.user,
      status: poll.status,
      respondents: poll.respondents || [],
      questions: poll.questions ? JSON.parse(poll.questions) : [],
      dateOpen: poll.dateOpen,
      dateClose: poll.dateClose,
      create: poll.createdAt,
    }
  }
  static dataForList(poll) {
    return {
      id: poll._id,
      title: poll.title,
      status: poll.status,
      create: poll.createdAt,
    }
  }
}

poll.loadClass(Poll)

export default mongoose.model('Poll', poll)
