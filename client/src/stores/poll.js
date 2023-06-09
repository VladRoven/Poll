import { observable, action, makeObservable } from 'mobx'
import { poll, user } from '../api/index'
import stores from './index'

export class Poll {
  @observable polls = []

  constructor() {
    makeObservable(this)
  }

  errorHandler(error) {
    switch (error.status) {
      case 401:
        this.clearPoll()
        stores.User.clearData()
        stores.User.setToken(null)
        stores.User.tokenChecked = false
        localStorage.clear()
        break
    }
  }

  @action clearPoll() {
    this.polls = []
  }

  @action async loadPoll() {
    try {
      const polls = await poll.list()
    } catch (error) {
      this.errorHandler(error)
    }
  }
}

export default new Poll()
