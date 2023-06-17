import { User } from '@poll/mongo'
import restifyErrors from 'restify-errors'

const { ForbiddenError, InvalidArgumentError } = restifyErrors

export default async (req, res, next) => {
  try {
    const { id } = req.body
    const { _id, admin } = req.user

    if (!admin && id && id !== _id) throw new ForbiddenError('No rights')
    const result = await User.deleteOne({ ...(id ? { _id: id } : { _id }) })

    if (result.deletedCount === 0)
      throw new InvalidArgumentError('Remove error')

    res.status(200).json({ success: result.deletedCount === 1 })
  } catch (error) {
    next(error)
  }
}
