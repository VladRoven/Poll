import request from './request'

export default {
  list: async params => await request.get('/poll', params),
  create: async params => await request.post('/poll', params),
}
