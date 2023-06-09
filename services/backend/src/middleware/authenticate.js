import restifyErrors from 'restify-errors'
import jwt from 'jsonwebtoken'
import { User } from '@poll/mongo'

const { UnauthorizedError } = restifyErrors
const { JWT_SECRET } = process.env

export default async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.replace('Bearer ', '')
    if (!token) throw new UnauthorizedError('Not authorized')

    jwt.verify(token, JWT_SECRET, async (err, data) => {
      if (err)
        return res.status(401).json({
          message: 'Token is invalid',
          status: 401,
          type: 'ForbiddenError',
        })
      const user = await User.find({ _id: data.id })
        .lean()
        .then(([response]) => response)

      if (!user)
        return res.status(401).json({
          message: 'User not found',
          status: 401,
          type: 'ForbiddenError',
        })
      req.user = user
      next()
    })
  } catch (error) {
    next(error)
  }
}
