import request from './request'

export default {
  get: async params => await request.get('/poll', params),
  create: async params => await request.post('/poll', params),
  remove: async params => await request.delete('/poll', params),
  update: async params => await request.put('/poll', params),
}
