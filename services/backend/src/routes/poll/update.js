import { Poll, ObjectId } from '@poll/mongo'
import restifyErrors from 'restify-errors'
import { validator } from '../../helpers/index.js'
import Joi from 'joi'

const { ForbiddenError, InvalidArgumentError } = restifyErrors

export default async (req, res, next) => {
  try {
    const { id } = req.body
    const { _id } = req.user
    const { dateClose, dateOpen, questions, respondents, status, title, user } =
      validator(
        req.body.data,
        Joi.object().keys({
          dateClose: Joi.date(),
          dateOpen: Joi.date(),
          questions: Joi.string(),
          respondents: Joi.array(),
          status: Joi.string(),
          title: Joi.string(),
          user: Joi.string(),
        })
      )

    const [poll] = await Poll.find({ user: _id, _id: id }).lean()
    if (!poll) throw new ForbiddenError('No rights')
    const result = await Poll.updateOne(
      { _id: id },
      {
        $set: {
          ...(dateClose ? { dateClose } : {}),
          ...(dateOpen ? { dateOpen } : {}),
          ...(questions ? { questions } : {}),
          ...(respondents ? { respondents } : {}),
          ...(status ? { status } : {}),
          ...(title ? { title } : {}),
          ...(user ? { user: ObjectId(user) } : {}),
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
