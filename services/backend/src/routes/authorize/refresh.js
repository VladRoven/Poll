import { User } from '@poll/mongo'
import restifyErrors from 'restify-errors'
import jwt from 'jsonwebtoken'
import { generateTokens } from '../../helpers/index.js'

const { MissingParameterError } = restifyErrors
const { JWT_REFRESH } = process.env

export default async (req, res, next) => {
  try {
    const { refreshToken: refreshTokenReq } = req.body
    const accessTokenReq = req.headers['authorization']?.replace('Bearer ', '')

    if (!accessTokenReq || !refreshTokenReq)
      throw new MissingParameterError('Missing token')
    jwt.verify(refreshTokenReq, JWT_REFRESH, async (err, data) => {
      if (err)
        return res.status(401).json({
          message: 'Token is invalid',
          status: 401,
          type: 'ForbiddenError',
        })
      const { refreshToken: refreshTokenDB } = await User.find(
        { _id: data.id },
        { refreshToken: 1 }
      )
        .lean()
        .then(([response]) => response)
      if (
        refreshTokenReq !== refreshTokenDB ||
        data.token !== accessTokenReq.slice(accessTokenReq.length - 15)
      )
        return res.status(401).json({
          message: 'Token is invalid',
          status: 401,
          type: 'ForbiddenError',
        })

      const { accessToken, refreshToken } = generateTokens(data.id, data.admin)
      await User.updateOne(
        { _id: data.id },
        { $set: { refreshToken } },
        { upsert: true }
      )
      return res.status(200).json({
        accessToken,
        refreshToken,
      })
    })
  } catch (error) {
    next(error)
  }
}
