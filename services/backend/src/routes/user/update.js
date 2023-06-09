import { User } from '@poll/mongo'
import restifyErrors from 'restify-errors'
import bcrypt from 'bcrypt'
import { validator } from '../../helpers/index.js'
import Joi from 'joi'

const { ForbiddenError, InvalidArgumentError } = restifyErrors

export default async (req, res, next) => {
  try {
    const { id } = req.body
    const { _id, admin } = req.user
    const { firstName, lastName, email, password, image } = validator(
      req.body.data,
      Joi.object().keys({
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string(),
        image: Joi.string(),
      })
    )

    if (!admin && id && id !== _id) throw new ForbiddenError('No rights')
    const hashPassword = password
      ? await bcrypt.hash(data.password, 7)
      : undefined
    const result = await User.updateOne(
      { ...(id ? { _id: id } : { _id }) },
      {
        $set: {
          ...(firstName ? { firstName } : {}),
          ...(lastName ? { lastName } : {}),
          ...(email ? { email } : {}),
          ...(image ? { image } : {}),
          ...(hashPassword ? { hashPassword } : {}),
        },
      },
      { upsert: true }
    )

    if (result.modifiedCount === 0)
      throw new InvalidArgumentError('Update error')
    const user = await User.find(
      { ...(id ? { _id: id } : { _id }) },
      { refreshToken: 0 }
    )
      .lean()
      .then(([response]) => response)

    res.status(200).json(User.dump(user))
  } catch (error) {
    next(error)
  }
}
