const { API_URL, API_PREFIX } = process.env
const options = {
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'same-origin',
}

const formatGET = params => {
  const fields = Object.keys(params)
  if (!fields.length) return ''
  return `?${fields
    .reduce(
      (acc, field) => [
        ...acc,
        ...(Array.isArray(params[field])
          ? params[field].map(
              value => `${field}[]=${encodeURIComponent(value)}`
            )
          : [`${field}=${encodeURIComponent(params[field])}`]),
      ],
      []
    )
    .join('&')}`
}

const errorHandler = value =>
  value.then(err => {
    throw {
      message: err.message,
      status: err.status,
      type: err.type,
    }
  })

export default {
  get: (url, params = {}) =>
    fetch(`${API_URL}${API_PREFIX}${url}${formatGET(params)}`, {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken')
          ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
          : {}),
      },
    })
      .then(response =>
        response.ok ? response.json() : Promise.reject(response.json())
      )
      .catch(errorHandler),
  post: (url, params = {}) =>
    fetch(`${API_URL}${API_PREFIX}${url}`, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken')
          ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
          : {}),
      },
      body: JSON.stringify(params),
    })
      .then(response =>
        response.ok ? response.json() : Promise.reject(response.json())
      )
      .catch(errorHandler),
  put: (url, params = {}) =>
    fetch(`${API_URL}${API_PREFIX}${url}`, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken')
          ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
          : {}),
      },
      body: JSON.stringify(params),
    })
      .then(response =>
        response.ok ? response.json() : Promise.reject(response.json())
      )
      .catch(errorHandler),
  delete: (url, params = {}) =>
    fetch(`${API_URL}${API_PREFIX}${url}`, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('accessToken')
          ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
          : {}),
      },
      body: JSON.stringify(params),
    })
      .then(response =>
        response.ok ? response.json() : Promise.reject(response.json())
      )
      .catch(errorHandler),
}
