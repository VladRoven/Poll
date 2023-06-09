import { Poll } from '@poll/mongo'

export default async (req, res, next) => {
  try {
    const { _id } = req.user
    console.log(_id)
    const polls = await Poll.find(
      { user: _id },
      { id: 1, title: 1, status: 1, createdAt: 1 }
    )
      .sort({ createdAt: -1 })
      .lean()

    res.status(200).json(polls.map(poll => Poll.dataForList(poll)))
  } catch (error) {
    next(error)
  }
}
