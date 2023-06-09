import { observable, action, makeObservable } from 'mobx'
import { user } from '../api/index'
import jwtDecode from 'jwt-decode'
import dayjs from 'dayjs'
import stores from './index'
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from '../enums/constants'
import { checkValid } from '../helpers/index'

export class User {
  @observable token = localStorage.getItem('accessToken') || null
  @observable data = {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    admin: false,
    image: null,
    permissions: {
      createPoll: false,
      respond: false,
      login: false,
    },
    register: '',
    lastUpdate: '',
  }
  @observable tokenChecked = false
  @observable actualRequests = {
    login: false,
    register: false,
    uploadImage: false,
    update: false,
    remove: false,
    resetPassword: false,
  }

  constructor() {
    makeObservable(this)
  }

  async errorHandler(error, request) {
    switch (error.status) {
      case 401:
        await this.checkToken()
        request()
        break
      case 11000:
        stores.Common.addInfoCard(`Користувач з таким e-mail вже існує`)
        break
    }
  }

  @action setActualReqest(requset, status) {
    this.actualRequests = {
      ...this.actualRequests,
      [requset]: status,
    }
  }

  @action clearActualRequest() {
    this.actualRequests = {
      login: false,
      register: false,
      uploadImage: false,
      change: false,
    }
  }

  @action setToken(token) {
    this.token = token
  }

  @action setData(data) {
    this.data = data
  }

  @action clearData() {
    this.data = {
      id: null,
      firstName: '',
      lastName: '',
      email: '',
      admin: false,
      image: null,
      permissions: {
        createPoll: false,
        respond: false,
        login: false,
      },
      register: '',
      lastUpdate: '',
    }
  }

  @action clearAllData() {
    this.clearData()
    this.token = null
    this.tokenChecked = true
    localStorage.clear()
  }

  @action async checkToken() {
    if (!this.token) {
      this.clearData()
      this.tokenChecked = true
      return
    }
    this.tokenChecked = false
    const { exp } = jwtDecode(this.token)
    if (dayjs(exp * 1000).diff(dayjs()) >= 0) {
      this.tokenChecked = true
      return
    }

    try {
      const localRefreshToken = localStorage.getItem('refreshToken')
      const { accessToken, refreshToken } = await user.refresh({
        refreshToken: localRefreshToken,
      })

      if (!accessToken || !refreshToken) {
        this.clearAllData()
        return
      }
      this.token = accessToken
      this.tokenChecked = true
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    } catch (error) {
      this.clearAllData()
    }
  }

  @action async login(email, password) {
    if (
      !checkValid([
        {
          field: email,
          regex: EMAIL_REGEX,
          errorText: 'Некоректний e-mail',
        },
        {
          field: password,
          regex: PASSWORD_REGEX,
          errorText:
            'Пароль повинен містити: більше 8 символів; лише цифри та букви',
        },
      ])
    )
      return

    try {
      if (this.actualRequests.login) return
      this.setActualReqest('login', true)
      const {
        id,
        firstName,
        lastName,
        admin,
        image,
        permissions,
        register,
        lastUpdate,
        accessToken,
        refreshToken,
      } = await user.signin({
        email,
        password,
      })

      this.token = accessToken
      this.tokenChecked = true
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      this.setData({
        id,
        firstName,
        lastName,
        email,
        admin,
        image,
        permissions,
        register,
        lastUpdate,
      })
    } catch (error) {
      stores.Common.showModal({
        type: 'info',
        text:
          error.status === 404
            ? 'Немає зареєстрованих користувачів з цим e-mail'
            : 'Невірний e-mail або пароль',
        btnConfirmTitle: 'Зрозумів',
      })
    } finally {
      this.setActualReqest('login', false)
    }
  }

  @action async register(firstName, lastName, email, password) {
    if (
      !checkValid([
        {
          field: firstName,
          regex: NAME_REGEX,
          errorText: `Некоректне ім'я`,
        },
        {
          field: lastName,
          regex: NAME_REGEX,
          errorText: 'Некоректне прізвище',
        },
        {
          field: email,
          regex: EMAIL_REGEX,
          errorText: 'Некоректний e-mail',
        },
        {
          field: password,
          regex: PASSWORD_REGEX,
          errorText:
            'Пароль повинен містити: більше 8 символів; лише цифри та букви',
        },
      ])
    )
      return

    try {
      if (this.actualRequests.register) return
      this.setActualReqest('register', true)
      const {
        id,
        admin,
        permissions,
        register,
        lastUpdate,
        accessToken,
        refreshToken,
      } = await user.signup({
        firstName,
        lastName,
        email,
        password,
      })

      this.token = accessToken
      this.tokenChecked = true
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      this.setData({
        id,
        firstName,
        lastName,
        email,
        image: null,
        admin,
        permissions,
        register,
        lastUpdate,
      })
    } catch (error) {
      stores.Common.showModal({
        type: 'info',
        text:
          error.status === 409
            ? 'Із цим e-mail вже зареєстрований користувач'
            : 'Невірний e-mail або пароль',
        btnConfirmTitle: 'Зрозумів',
      })
    } finally {
      this.setActualReqest('register', false)
    }
  }

  @action logout() {
    user
      .logout()
      .then(() => {
        this.clearAllData()
      })
      .catch(error =>
        this.errorHandler(error, () => {
          this.logout()
        })
      )
  }

  @action async get(reqId = null) {
    try {
      const {
        id,
        firstName,
        lastName,
        email,
        admin,
        image,
        permissions,
        register,
        lastUpdate,
      } = await user.get({ ...(reqId ? { id: reqId } : {}) })

      this.setData({
        id,
        firstName,
        lastName,
        email,
        admin,
        image,
        permissions,
        register,
        lastUpdate,
      })
    } catch (error) {
      this.errorHandler(error, () => {
        this.get(reqId)
      })
    }
  }

  @action async update(data, reqId = null) {
    try {
      if (this.actualRequests.update) return
      this.setActualReqest('update', true)
      const {
        id,
        firstName,
        lastName,
        email,
        admin,
        image,
        permissions,
        register,
        lastUpdate,
      } = await user.update({ ...(reqId ? { id: reqId } : {}), data })

      this.setData({
        id,
        firstName,
        lastName,
        email,
        image,
        admin,
        permissions,
        register,
        lastUpdate,
      })
      return true
    } catch (error) {
      this.errorHandler(error, () => {
        this.update(data, reqId)
      })
      return false
    } finally {
      this.setActualReqest('update', false)
    }
  }

  @action async remove(reqId = null) {
    try {
      if (this.actualRequests.remove) return
      this.setActualReqest('remove', true)
      const { success } = await user.remove({
        ...(reqId ? { id: reqId } : {}),
      })

      if (success) this.clearAllData()
    } catch (error) {
      this.errorHandler(error, () => {
        this.update(data, reqId)
      })
    } finally {
      this.setActualReqest('remove', false)
    }
  }

  @action async uploadImage(img, onHide) {
    if (this.actualRequests.uploadImage) return
    this.setActualReqest('uploadImage', true)
    const formData = new FormData()
    formData.append('image', img)

    try {
      const result = await fetch('https://api.imgur.com/3/image/', {
        method: 'post',
        headers: {
          Authorization: `Client-ID bca78d71abeb154`,
        },
        body: formData,
      })
        .then(data => data.json())
        .then(value => value)

      if (result.success) {
        await this.update({ image: result.data.link }).then(
          response =>
            response &&
            stores.Common.addInfoCard(`Фото профілю успішно оновлено`)
        )
      }
      onHide()
    } catch (error) {
      this.errorHandler(error, () => {
        this.uploadImage(img, onHide)
      })
    } finally {
      this.setActualReqest('uploadImage', false)
    }
  }

  @action async resetPassword(email, hide) {
    if (this.actualRequests.resetPassword) return
    this.setActualReqest('resetPassword', true)

    try {
      const { success } = await user.resetPassword({
        email,
      })

      if (success) {
        stores.Common.addInfoCard(
          `На вказаний e-mail було відправлено новий пароль`
        )
        hide()
      }
    } catch (error) {
      switch (error.status) {
        case 404:
          stores.Common.addInfoCard(`Користувача з таким e-mail не знайдено`)
          break
      }
    } finally {
      this.setActualReqest('resetPassword', false)
    }
  }
}

export default new User()
