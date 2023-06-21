import { Poll } from '@poll/mongo'
import restifyErrors from 'restify-errors'

const { ForbiddenError, NotFoundError } = restifyErrors

export default async (req, res, next) => {
  try {
    const { _id } = req.user
    const { id } = req.query

    if (!id) {
      const polls = await Poll.find(
        { user: _id },
        { id: 1, title: 1, status: 1, createdAt: 1 }
      )
        .sort({ createdAt: -1 })
        .lean()

      return res.status(200).json(polls.map(poll => Poll.dataForList(poll)))
    }

    const [poll] = await Poll.find({ _id: id })
      .populate({
        path: 'respondents.user',
        model: 'User',
        select: { firstName: 1, lastName: 1 },
      })
      .lean()
    if (!poll) throw new NotFoundError('Not Found')
    if (poll.status === 'dev' && _id.toString() !== poll.user.toString())
      throw new ForbiddenError(`You aren't creater`)

    res
      .status(200)
      .json(
        poll.user.toString() === _id.toString()
          ? Poll.dumpCreator(poll)
          : Poll.dumpRespondent(poll, _id)
      )
  } catch (error) {
    next(error)
  }
}
