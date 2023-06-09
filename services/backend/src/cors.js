const METHODS = ['PUT', 'PATCH', 'OPTIONS', 'POST', 'GET', 'DELETE']
const HEADERS = ['Authorization', 'Content-Type', 'Content-Disposition']
const EXPOSED_HEADERS = ['Content-Length', 'Content-Disposition']

export default (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', METHODS.join(','))
  res.header('Access-Control-Allow-Headers', HEADERS.join(','))
  res.header('Access-Control-Expose-Headers', EXPOSED_HEADERS.join(','))
  return req.method === 'OPTIONS' ? res.sendStatus(200) : next()
}
