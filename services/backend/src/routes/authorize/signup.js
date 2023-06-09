import { User } from '@poll/mongo'
import bcrypt from 'bcrypt'
import Joi from 'joi'
import { validator, generateTokens } from '../../helpers/index.js'
import restifyErrors from 'restify-errors'

const { ConflictError } = restifyErrors

export default async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = validator(
      req.body,
      Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      })
    )
    const hashPassword = await bcrypt.hash(password, 7)
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    })
    const { accessToken, refreshToken } = generateTokens(user._id, false)
    user.refreshToken = refreshToken
    await user.save().catch(err => {
      if (err.code === 11000) throw new ConflictError('Duplicate entry')
    })
    return res
      .status(200)
      .json(User.dump({ ...user._doc, accessToken, refreshToken }))
  } catch (error) {
    next(error)
  }
}
