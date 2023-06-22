import jwt from 'jsonwebtoken'

const { JWT_SECRET, JWT_REFRESH } = process.env

export default (id, admin) => {
  const accessToken = jwt.sign(
    {
      id,
      admin,
    },
    JWT_SECRET,
    {
      expiresIn: '1h',
    }
  )
  const refreshToken = jwt.sign(
    {
      id,
      admin,
      token: accessToken.slice(accessToken.length - 15),
    },
    JWT_REFRESH,
    {
      expiresIn: '365d',
    }
  )

  return {
    accessToken,
    refreshToken,
  }
}
