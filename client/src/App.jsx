import React, { useEffect } from 'react'
import loadable from '@loadable/component'
import { Routes, Route } from 'react-router-dom'
import './assets/styles/global'
import './assets/styles/pages'
import './assets/styles/fonts'
import Loader from './components/loader'
import AOS from 'aos'
import 'aos/dist/aos.css'
import PrivateRouter from './privateRouter'
import Modal from '../src/components/modal'
import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'
import InfoCards from './components/infoCards'
import { inject, observer } from 'mobx-react'

dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  months: [
    'Січень',
    'Лютий',
    'Березень',
    'Квітень',
    'Травень',
    'Червень',
    'Липень',
    'Серпень',
    'Вересень',
    'Жовтень',
    'Листопад',
    'Грудень',
  ],
})

const Main = loadable(() => import('./containers/main'), {
  fallback: <Loader />,
})
const About = loadable(() => import('./containers/about'), {
  fallback: <Loader />,
})
const SignIn = loadable(() => import('./containers/signIn'), {
  fallback: <Loader />,
})
const SignUp = loadable(() => import('./containers/signUp'), {
  fallback: <Loader />,
})
const NotFound = loadable(() => import('./containers/notFound'), {
  fallback: <Loader />,
})
const Profile = loadable(() => import('./containers/profile'), {
  fallback: <Loader />,
})
const Constructor = loadable(() => import('./containers/constructor'), {
  fallback: <Loader />,
})
const Poll = loadable(() => import('./containers/poll'), {
  fallback: <Loader />,
})

const App = inject('User')(
  observer(({ User }) => {
    useEffect(() => {
      AOS.init()
      if (User.token) User.get()
    }, [])

    return (
      <>
        <Modal />
        <InfoCards />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route element={<PrivateRouter />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/constructor" element={<Constructor />} />
            <Route path="/poll" element={<Poll />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    )
  })
)

export default App
