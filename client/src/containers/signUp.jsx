import React, { useRef, useEffect } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import Input from '../components/input'
import Button from '../components/button'
import { inject, observer } from 'mobx-react'
import { useNavigate } from 'react-router-dom'

const SignUp = inject('User')(
  observer(({ User }) => {
    const firstName = useRef(null)
    const lastName = useRef(null)
    const email = useRef(null)
    const pass = useRef(null)
    const navigate = useNavigate()

    const handler = () =>
      User.register(
        firstName.current.value.trim(),
        lastName.current.value.trim(),
        email.current.value.trim().toLowerCase(),
        pass.current.value.trim()
      )

    useEffect(() => {
      if (!User.token) return
      navigate('/profile')
    }, [])

    useEffect(() => {
      if (!User.tokenChecked || !User.token) return
      navigate('/profile')
    }, [User.tokenChecked, User.token])

    return (
      <>
        <Header />
        <div className="container" id="sign-up-page">
          <div className="block">
            <h2>Реєстрація</h2>
            <Input placeholder="Ім’я" ref={firstName} />
            <Input placeholder="Прізвище" ref={lastName} />
            <Input placeholder="E-mail" type="email" ref={email} />
            <Input placeholder="Пароль" type="password" ref={pass} />
            <Button onClick={handler}>Зареєструватись</Button>
          </div>
          <div className="block">
            <h1>Створи своє опитування та поширюй його</h1>
            <div className="logo">
              <p>P</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  })
)

export default SignUp
