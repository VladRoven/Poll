import restifyErrors from 'restify-errors'

const { ForbiddenError } = restifyErrors

export default (req, res, next) => {
  if (!req.user.admin)
    throw new ForbiddenError('You are not allowed to do that')
  return next()
}
