import request from './request'

export default {
  list: async params => await request.get('/poll', params)
}
