import request from './request'

export default {
  signin: async params => request.post('/authorize/signin', params),
  signup: async params => request.post('/authorize/signup', params),
  refresh: async params => request.put('/authorize/refresh', params),
  logout: async params => request.put('/authorize/logout', params),
  get: async params => request.get('/user', params),
  update: async params => request.put('/user', params),
  remove: async params => request.delete('/user', params),
  resetPassword: async params => request.put('/user/reset-pass', params),
}
