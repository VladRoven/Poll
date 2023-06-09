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
} from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'
import Button from '../components/button'
import { checkValid } from '../helpers'
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from '../enums/constants'

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

    useEffect(() => {
      Poll.loadPoll()
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
              {!Poll.polls.length ? (
                <p id="not-found">Опитувань немає</p>
              ) : (
                <div></div>
              )}
              <Button id="create">Створити</Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  })
)

export default Profile