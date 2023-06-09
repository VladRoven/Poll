import { User } from '@poll/mongo'
import restifyErrors from 'restify-errors'

const { NotFoundError } = restifyErrors

export default async (req, res, next) => {
  try {
    const { id } = req.param
    const { _id } = req.user
    const user = await User.find({ ...(id ? { _id: id } : { _id }) })
      .lean()
      .then(([response]) => response)

    if (!user) throw new NotFoundError('User not found')
    res.status(200).json(User.dump(user))
  } catch (error) {
    next(error)
  }
}
