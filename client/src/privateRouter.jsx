import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { Navigate, Outlet } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import Loader from './components/loader'

const PrivateRouter = inject('User')(
  observer(({ User, onlyAdmin = false }) => {
    const [status, setStatus] = useState('loader')

    useEffect(() => {
      User.checkToken()
    }, [])

    useEffect(() => {
      if (!User.token) {
        setStatus('redirect')
        return
      }
      const { admin } = jwtDecode(User.token)
      if (onlyAdmin && !admin) {
        setStatus('redirect')
        return
      }
      if (User.tokenChecked) {
        setStatus('access')
        return
      }
    }, [User.token, User.tokenChecked])

    switch (status) {
      case 'access':
        return <Outlet />
      case 'redirect':
        return <Navigate to="/sign-in" />
      case 'loader':
        return <Loader />
    }
  })
)

export default PrivateRouter
