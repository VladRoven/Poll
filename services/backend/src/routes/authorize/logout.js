import { User } from '@poll/mongo'

export default async (req, res, next) => {
  try {
    const result = await User.updateOne(
      { _id: req.user._id },
      { $set: { refreshToken: null } },
      { upsert: true }
    )

    return res.status(200).json({ success: result.modifiedCount === 1 })
  } catch (error) {
    next(error)
  }
}
