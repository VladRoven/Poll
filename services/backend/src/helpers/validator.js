import restifyErrors from 'restify-errors'

const { InvalidArgumentError } = restifyErrors

export default (body, schema) => {
  const { error, value } = schema.validate(body, {
    convert: true,
    abortEarly: true
  })

  if (error) {
    const message = error.details.map(detail => detail.message).join('. ')
    throw new InvalidArgumentError(message)
  }
  return value
}
