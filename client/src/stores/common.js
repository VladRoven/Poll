import { observable, action, makeObservable } from 'mobx'

export class Common {
  @observable infoCards = []
  @observable isShowModal = false
  @observable modalConfig = {
    type: 'confirm',
    text: '',
    btnConfirmTitle: 'Ок',
    btnCancelTitle: 'Закрити',
    hideOnSubmit: true,
    style: {},
    onSubmit: e => {},
    onHide: e => {},
  }

  constructor() {
    makeObservable(this)
  }

  @action showModal(config) {
    this.isShowModal = true
    this.modalConfig = {
      ...this.modalConfig,
      ...config,
    }
  }

  @action hideModal() {
    this.isShowModal = false
    setTimeout(() => {
      this.modalConfig = {
        type: 'confirm',
        text: '',
        btnConfirmTitle: 'Ок',
        btnCancelTitle: 'Закрити',
        hideOnSubmit: true,
        style: {},
        onSubmit: e => {},
        onHide: e => {},
      }
    }, 150)
  }

  @action addInfoCard(text) {
    if (this.infoCards.length === 5) this.infoCards.shift()
    this.infoCards = [...this.infoCards, { date: Date.now(), text }]
  }

  @action removeInfoCard(date) {
    this.infoCards.splice(
      this.infoCards.findIndex(card => card.date === date),
      1
    )
  }
}

export default new Common()
