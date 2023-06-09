import { Poll } from '@poll/mongo'
import Joi from 'joi'
import { validator } from '../../helpers/index.js'

export default async (req, res, next) => {
  try {
    const { _id } = req.user
    const { title } = validator(
      req.body,
      Joi.object().keys({
        title: Joi.string().required(),
      })
    )
    const poll = new Poll({
      title,
      user: _id,
    })

    await poll.save()
    res.status(200).json(Poll.dataForList(poll._doc))
  } catch (error) {
    next(error)
  }
}
