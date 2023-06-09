import React, { useEffect, useRef, useState } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import Input from '../components/input'
import Button from '../components/button'
import { inject, observer } from 'mobx-react'
import { useNavigate } from 'react-router-dom'

const SignIn = inject(
  'User',
  'Common'
)(
  observer(({ User, Common, ...props }) => {
    const email = useRef(null)
    const pass = useRef(null)
    const navigate = useNavigate()

    const handlerLogin = () =>
      User.login(
        email.current.value.trim().toLowerCase(),
        pass.current.value.trim()
      )

    const handlerForgot = () =>
      Common.showModal({
        text: 'Вы забыли пароль?',
        btnConfirmTitle: 'Да',
        btnCancelTitle: 'Нет',
        onSubmit: () => {
          console.log('submit')
        },
      })

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
        <div className="container" id="login-page">
          <div className="block">
            <h2>Авторизація</h2>
            <Input placeholder="E-mail" ref={email} />
            <Input placeholder="Пароль" type="password" ref={pass} />
            <div className="buttons">
              <Button onClick={handlerLogin}>Увійти</Button>
              <Button onClick={handlerForgot}>Забув пароль</Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  })
)

export default SignIn
