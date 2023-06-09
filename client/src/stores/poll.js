import { observable, action, makeObservable } from 'mobx'
import { poll } from '../api/index'
import stores from './index'

export class Poll {
  @observable polls = []
  @observable actualRequests = {
    list: false,
    create: false,
  }

  constructor() {
    makeObservable(this)
  }

  async errorHandler(error, request) {
    switch (error.status) {
      case 401:
        await stores.User.checkToken()
        request()
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
      list: false,
      create: false,
    }
  }

  @action clearPoll() {
    this.polls = []
  }

  @action async loadPoll() {
    try {
      if (this.actualRequests.list) return
      this.setActualReqest('list', true)

      const polls = await poll.list()
      this.polls = polls
    } catch (error) {
      this.errorHandler(error)
    } finally {
      this.setActualReqest('list', false)
    }
  }

  @action async createPoll(title) {
    try {
      if (this.actualRequests.create) return
      this.setActualReqest('create', true)

      const pollRes = await poll.create({ title })
      this.polls = [pollRes, ...this.polls]
      stores.Common.addInfoCard('Опитування створено')
    } catch (error) {
      this.errorHandler(error, () => {
        this.createPoll(title)
      })
    } finally {
      this.setActualReqest('create', false)
    }
  }
}

export default new Poll()
