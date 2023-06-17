import { observable, action, makeObservable } from 'mobx'
import { poll } from '../api/index'
import stores from './index'

export class Poll {
  @observable polls = []
  @observable actualRequests = {
    list: false,
    create: false,
    get: false,
    remove: false,
    update: false,
  }
  @observable currentPoll = null
  @observable question = {}

  constructor() {
    makeObservable(this)
  }

  async errorHandler(error, request, actual) {
    switch (error.status) {
      case 401:
        if (!stores.User.actualRequests.refresh) await stores.User.checkToken()
        if (actual) this.setActualReqest(actual, false)
        request()
        break
    }
  }

  @action setQuestion(question) {
    this.question = question
  }

  @action setQuestionField(data) {
    this.question = {
      ...this.question,
      ...data,
    }
  }

  @action removeVariant(id) {
    const index = this.question.variants.findIndex(variant => variant.id === id)
    if (this.question.variants.length === 1) {
      this.question.variants = undefined
      return
    }
    this.question.variants.splice(index, 1)
  }

  @action setVariant(id, data) {
    const index = this.question.variants.findIndex(variant => variant.id === id)
    this.question.variants[index] = {
      id,
      variant: data,
    }
  }

  @action getVariant(id = null) {
    if (id) return this.question.variants.find(variant => variant.id === id)
    const lastIndex = this.question.variants.length - 1
    return this.question.variants[lastIndex]
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
      get: false,
      remove: false,
    }
  }

  @action clearPolls() {
    this.polls = []
  }

  @action async loadPolls() {
    try {
      if (this.actualRequests.list) return
      this.setActualReqest('list', true)

      const polls = await poll.get()
      this.polls = polls
    } catch (error) {
      this.errorHandler(
        error,
        () => {
          this.loadPolls()
        },
        'list'
      )
    } finally {
      this.setActualReqest('list', false)
    }
  }

  @action async loadPoll(reqId) {
    try {
      if (this.actualRequests.get) return
      this.setActualReqest('get', true)

      const resPoll = await poll.get({ id: reqId })
      this.currentPoll = resPoll
    } catch (error) {
      this.errorHandler(
        error,
        () => {
          this.loadPoll(reqId)
        },
        'get'
      )
    } finally {
      this.setActualReqest('get', false)
    }
  }

  @action setCurrentPollField(data) {
    this.currentPoll = {
      ...this.currentPoll,
      ...data,
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
      this.errorHandler(
        error,
        () => {
          this.createPoll(title)
        },
        'create'
      )
    } finally {
      this.setActualReqest('create', false)
    }
  }

  @action async remove(reqId) {
    try {
      if (this.actualRequests.remove) return
      this.setActualReqest('remove', true)
      await poll.remove({ id: reqId })
    } catch (error) {
      this.errorHandler(
        error,
        () => {
          this.remove(reqId)
        },
        'remove'
      )
    } finally {
      this.setActualReqest('remove', false)
    }
  }

  @action async update(data, id) {
    try {
      if (this.actualRequests.update) return
      this.setActualReqest('update', true)

      const { success } = await poll.update({
        id,
        data,
      })
      return success
    } catch (error) {
      this.errorHandler(
        error,
        () => {
          this.update(data, id)
        },
        'update'
      )
    } finally {
      this.setActualReqest('update', false)
    }
  }

  @action async addQuestion(question) {
    await this.update(
      { questions: JSON.stringify([...this.currentPoll.questions, question]) },
      this.currentPoll.id
    )
    this.currentPoll = {
      ...this.currentPoll,
      questions: [...this.currentPoll.questions, question],
    }
  }

  @action async updateQuestion(question) {
    const questions = this.currentPoll.questions.map(_question => {
      if (question.id === _question.id) _question = question
      return _question
    })
    await this.update(
      { questions: JSON.stringify(questions) },
      this.currentPoll.id
    )
    this.currentPoll = {
      ...this.currentPoll,
      questions,
    }
  }

  @action getQuestion(id) {
    return this.currentPoll.questions.find(question => question.id === id)
  }

  @action async removeQuestion(id) {
    const questions = [...this.currentPoll.questions]
    questions.splice(
      questions.findIndex(question => question.id === id),
      1
    )
    await this.update(
      { questions: JSON.stringify(questions) },
      this.currentPoll.id
    )
    this.currentPoll = {
      ...this.currentPoll,
      questions: questions,
    }
  }
}

export default new Poll()
