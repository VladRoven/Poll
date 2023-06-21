import React, { useEffect, useRef } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import { inject, observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faImage,
  faArrowRightFromBracket,
  faPlus,
  faTrashCan,
  faScrewdriverWrench,
  faLock,
  faUnlock,
  faLink,
} from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'
import Button from '../components/button'
import { checkValid } from '../helpers'
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from '../enums/constants'
import { Link } from 'react-router-dom'

const Profile = inject(
  'Poll',
  'User',
  'Common'
)(
  observer(({ Poll, User, Common }) => {
    const uploadHandler = () => {
      Common.showModal({
        type: 'uploadImage',
        title: 'Оберіть фото',
        btnConfirmTitle: 'Завантажити',
        hideOnSubmit: false,
        onSubmit: (img, onHide) => User.uploadImage(img, onHide),
      })
    }

    const changeName = () => {
      Common.showModal({
        type: 'inputs',
        title: 'Зміна імені',
        btnConfirmTitle: 'Змінити',
        hideOnSubmit: false,
        style: {
          width: '500px',
        },
        fields: [
          {
            type: 'text',
            placeholder: `Введіть ім'я`,
            name: 'name',
          },
        ],
        onSubmit: async (fieldsRef, hideHandler) => {
          if (
            !checkValid([
              {
                field: fieldsRef.name.value.trim(),
                regex: NAME_REGEX,
                errorText: `Некоректне ім'я`,
              },
            ])
          )
            return
          await User.update({ firstName: fieldsRef.name.value }).then(
            response => response && Common.addInfoCard(`Ім'я успішно змінено`)
          )
          hideHandler()
        },
      })
    }

    const changeLastName = () => {
      Common.showModal({
        type: 'inputs',
        title: 'Зміна прізвище',
        btnConfirmTitle: 'Змінити',
        hideOnSubmit: false,
        style: {
          width: '500px',
        },
        fields: [
          {
            type: 'text',
            placeholder: `Введіть прізвище`,
            name: 'lastName',
          },
        ],
        onSubmit: async (fieldsRef, hideHandler) => {
          if (
            !checkValid([
              {
                field: fieldsRef.lastName.value.trim(),
                regex: NAME_REGEX,
                errorText: `Некоректне прізвище`,
              },
            ])
          )
            return
          await User.update({ lastName: fieldsRef.lastName.value }).then(
            response =>
              response && Common.addInfoCard(`Прізвище успішно змінено`)
          )
          hideHandler()
        },
      })
    }

    const changeEmail = () => {
      Common.showModal({
        type: 'inputs',
        title: 'Зміна e-mail',
        btnConfirmTitle: 'Змінити',
        hideOnSubmit: false,
        style: {
          width: '500px',
        },
        fields: [
          {
            type: 'text',
            placeholder: `Введіть e-mail`,
            name: 'email',
          },
        ],
        onSubmit: async (fieldsRef, hideHandler) => {
          if (
            !checkValid([
              {
                field: fieldsRef.email.value.trim(),
                regex: EMAIL_REGEX,
                errorText: `Некоректний e-mail`,
              },
            ])
          )
            return
          await User.update({ email: fieldsRef.email.value }).then(
            response => response && Common.addInfoCard('E-mail успішно змінено')
          )
          hideHandler()
        },
      })
    }

    const changePassword = () => {
      Common.showModal({
        type: 'inputs',
        title: 'Зміна паролю',
        btnConfirmTitle: 'Змінити',
        hideOnSubmit: false,
        style: {
          width: '500px',
        },
        fields: [
          {
            type: 'text',
            placeholder: `Новий пароль`,
            name: 'password',
          },
          {
            type: 'text',
            placeholder: `Підтвердіть пароль`,
            name: 'passwordConfirm',
          },
        ],
        onSubmit: async (fieldsRef, hideHandler) => {
          if (
            !checkValid([
              {
                field: fieldsRef.password.value.trim(),
                regex: PASSWORD_REGEX,
                errorText: `Некоректний пароль`,
              },
              {
                field: fieldsRef.passwordConfirm.value.trim(),
                regex: PASSWORD_REGEX,
                errorText: `Некоректний підтверджувальний пароль`,
              },
            ])
          )
            return
          if (
            fieldsRef.password.value.trim() !==
            fieldsRef.passwordConfirm.value.trim()
          ) {
            Common.addInfoCard('Паролі не співпадають')
            return
          }
          await User.update({ password: fieldsRef.password.value }).then(
            response => response && Common.addInfoCard('Пароль успішно змінено')
          )
          hideHandler()
        },
      })
    }

    const remove = () => {
      Common.showModal({
        text: 'Ви дійсно хочете видалити акаунт?',
        btnConfirmTitle: 'Так',
        btnCancelTitle: 'Ні',
        onSubmit: () => {
          User.remove()
        },
      })
    }

    const createPoll = () => {
      Common.showModal({
        type: 'inputs',
        title: 'Нове опитування',
        btnConfirmTitle: 'Створити',
        hideOnSubmit: false,
        style: {
          width: '500px',
        },
        fields: [
          {
            type: 'text',
            placeholder: `Введіть назву опитування`,
            name: 'title',
          },
        ],
        onSubmit: async (fieldsRef, hide) => {
          Poll.createPoll(fieldsRef.title.value.trim())
          hide()
        },
      })
    }

    useEffect(() => {
      Poll.loadPolls()

      return () => {
        Poll.clearPolls()
      }
    }, [])

    return (
      <>
        <Header />
        <div className="container" id="profile-page">
          <div className="block">
            <div
              className="user-data"
              data-aos="fade-right"
              data-aos-duration="500"
            >
              <FontAwesomeIcon
                title="Вийти"
                icon={faArrowRightFromBracket}
                id="logout"
                onClick={() => User.logout()}
              />
              <FontAwesomeIcon
                title="Видалити акаунт"
                icon={faTrashCan}
                id="remove"
                onClick={() => remove()}
              />
              <div id="user-img">
                <div id="add-img" title="Завантажити" onClick={uploadHandler}>
                  <FontAwesomeIcon icon={faPlus} />
                </div>
                {User.data.image ? (
                  <div
                    id="current"
                    style={{ backgroundImage: `url(${User.data.image})` }}
                  />
                ) : (
                  <FontAwesomeIcon icon={faImage} id="preview" />
                )}
              </div>
              <h3 id="name">
                {User.data.firstName} {User.data.lastName}
              </h3>
              <div id="data">
                <p>
                  Кількість опитувань: <b>{Poll.polls.length}</b>
                </p>
                <p>
                  E-mail: <b>{User.data.email || '-'}</b>
                </p>
                <p>
                  Дата реєстрації:{' '}
                  <b>
                    {User.data.register
                      ? dayjs(User.data.register).format('DD.MM.YYYY')
                      : '-'}
                  </b>
                </p>
              </div>
              <div className="buttons">
                <Button onClick={() => changeName()}>Змінити ім'я</Button>
                <Button onClick={() => changeLastName()}>
                  Змінити прізвище
                </Button>
                <Button onClick={() => changeEmail()}>Змінити e-mail</Button>
                <Button onClick={() => changePassword()}>Змінити пароль</Button>
              </div>
            </div>
            <div className="polls" data-aos="fade-left" data-aos-duration="500">
              {!Poll.polls.length && !Poll.actualRequests.list ? (
                <p id="not-found">Опитувань немає</p>
              ) : (
                <div className="list">
                  {Poll.polls.map(({ id, title, status }) => (
                    <div className="poll" key={id}>
                      <Link
                        to={`/${
                          status === 'dev' ? 'constructor' : 'poll'
                        }?id=${id}`}
                        className="data"
                      >
                        <p>{title}</p>
                        <span className="status">
                          {status === 'open' ? (
                            <FontAwesomeIcon title="Відкрито" icon={faUnlock} />
                          ) : status === 'close' ? (
                            <FontAwesomeIcon title="Закрито" icon={faLock} />
                          ) : (
                            <FontAwesomeIcon
                              title="В розробці"
                              icon={faScrewdriverWrench}
                            />
                          )}
                        </span>
                      </Link>
                      <span
                        className="post-link"
                        onClick={() => {
                          if (status === 'dev') {
                            Common.addInfoCard(
                              'Посилання не скопійовано. Опитування в розробці'
                            )
                            return
                          }
                          if (status === 'close') {
                            Common.addInfoCard(
                              'Посилання не скопійовано. Опитування закінчено'
                            )
                            return
                          }
                          if (navigator.clipboard && window.isSecureContext) {
                            navigator.clipboard.writeText(
                              `${document.location.origin}/poll?id=${id}`
                            )
                            Common.addInfoCard(
                              'Посилання скопійовано у буфер обміну'
                            )
                            return
                          }

                          const textarea = document.createElement('textarea')
                          textarea.value = `${document.location.origin}/poll?id=${id}`
                          textarea.style.position = 'absolute'
                          textarea.style.opacity = 0
                          document.body.prepend(textarea)
                          textarea.select()

                          try {
                            document.execCommand('copy')
                            Common.addInfoCard(
                              'Посилання скопійовано у буфер обміну'
                            )
                          } finally {
                            textarea.remove()
                          }
                        }}
                      >
                        <FontAwesomeIcon title="Посилання" icon={faLink} />
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <Button id="create" onClick={() => createPoll()}>
                Створити
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  })
)

export default Profile
