import stores from '../stores/index'

export const checkValid = params => {
  const errors = []
  params.map(
    ({ field, regex, errorText }) =>
      !new RegExp(regex).test(field) && errors.push(errorText)
  )

  if (!errors.length) return true
  stores.Common.addInfoCard(errors.join('\n'))
  return false
}

export const getObjectValue = (obj, path) => {
  const parts = path.split('.')
  if (parts.length == 1) {
    return obj ? obj[parts[0]] : undefined
  }
  return getObjectFieldValue(obj[parts[0]], parts.slice(1).join('.'))
}
