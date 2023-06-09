import { User } from '@poll/mongo'
import bcrypt from 'bcrypt'
import Joi from 'joi'
import { validator, generateTokens } from '../../helpers/index.js'
import restifyErrors from 'restify-errors'

const { InvalidCredentialsError, NotFoundError } = restifyErrors

export default async (req, res, next) => {
  try {
    const { email, password } = validator(
      req.body,
      Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      })
    )
    const user = await User.find({ email })
      .lean()
      .then(([response]) => response)

    if (!user) throw new NotFoundError('User not found')

    const validPassword = await bcrypt.compare(password, user.password)
    if (validPassword) {
      const { accessToken, refreshToken } = generateTokens(user._id, user.admin)
      await User.updateOne(
        { _id: user._id },
        { $set: { refreshToken } },
        { upsert: true }
      )
      return res
        .status(200)
        .json(User.dump({ ...user, accessToken, refreshToken }))
    }
    throw new InvalidCredentialsError('Invalid email or password')
  } catch (error) {
    next(error)
  }
}
