import { Poll } from '@poll/mongo'
import Joi from 'joi'
import { validator } from '../../helpers/index.js'
import restifyErrors from 'restify-errors'

const { ForbiddenError, InvalidArgumentError } = restifyErrors

export default async (req, res, next) => {
  try {
    const { _id } = req.user
    const { id } = validator(
      req.body,
      Joi.object().keys({
        id: Joi.string().required(),
      })
    )
    const [poll] = await Poll.find({ user: _id, _id: id }).lean()

    if (!poll) throw new ForbiddenError('No rights')
    const result = await Poll.deleteOne({ _id: id })

    if (result.deletedCount === 0)
      throw new InvalidArgumentError('Remove error')

    res.status(200).json({ success: result.deletedCount === 1 })
  } catch (error) {
    next(error)
  }
}
