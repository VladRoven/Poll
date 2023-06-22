import { Poll, ObjectId } from '@poll/mongo'
import restifyErrors from 'restify-errors'
import { validator } from '../../helpers/index.js'
import Joi from 'joi'

const { NotFoundError, ForbiddenError, InvalidArgumentError } = restifyErrors

export default async (req, res, next) => {
  try {
    const { _id } = req.user
    const { id, answers } = validator(
      req.body,
      Joi.object().keys({
        id: Joi.string().required(),
        answers: Joi.object().required(),
      })
    )

    const poll = await Poll.findOne({ _id: id }).lean()
    if (!poll) throw new NotFoundError('Poll not found')
    if (poll.status === 'close' || poll.status === 'dev')
      throw new ForbiddenError('Poll is not open')
    if (
      poll.respondents.some(
        ({ user }) => user._id.toString() === _id.toString()
      )
    )
      throw new ForbiddenError('You have already passed the poll')

    const result = await Poll.updateOne(
      { _id: id },
      {
        $push: {
          respondents: {
            answers,
            user: _id,
          },
        },
      },
      { upsert: true }
    )

    if (result.modifiedCount === 0)
      throw new InvalidArgumentError('Remove error')

    res.status(200).json({ success: result.modifiedCount === 1 })
  } catch (error) {
    next(error)
  }
}
