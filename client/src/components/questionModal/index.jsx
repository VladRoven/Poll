import { inject, observer } from 'mobx-react'
import React, { useCallback, useEffect, useState } from 'react'
import './style'
import Button from '../button'
import Input from '../input'
import { faCirclePlus, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const QuestionModal = inject(
  'Poll',
  'Common'
)(
  observer(({ Poll, Common, action, setAction, show, onHide }) => {
    const DELAY = 150
    const types = [
      {
        type: 'variants',
        label: 'Варіанти',
      },
      {
        type: 'open',
        label: 'Відкрите',
      },
      {
        type: 'scale',
        label: 'Шкала',
      },
    ]
    const [currentType, setCurrentType] = useState(types[0].type)
    const [isShow, setIsShow] = useState(false)
    const toggleShow = node => {
      if (!node) return
      if (show) {
        setTimeout(() => {
          node.classList.add('show')
        }, 20)
        return
      }
      node.classList.remove('show')
    }
    const backdrop = useCallback(toggleShow)
    const modal = useCallback(toggleShow)
    const hideHandler = () => {
      onHide()
      setTimeout(() => {
        Poll.setQuestion({})
        setAction('add')
        setCurrentType(types[0].type)
      }, DELAY)
    }
    const handler = () => {
      switch (currentType) {
        case 'variants': {
          const { title, variants, image } = {
            ...Poll.question,
            variants: Poll.question.variants || [],
          }
          if (!title) {
            Common.addInfoCard('Введіть питання')
            return
          }
          if (variants.length < 2) {
            Common.addInfoCard('Мінімальна кількість варіантів: 2')
            return
          }
          if (!Poll.getVariant().variant.trim().length) {
            Common.addInfoCard('Останній варіант не може бути порожнім')
            return
          }

          action === 'add'
            ? Poll.addQuestion({
                id: Date.now(),
                type: currentType,
                title: Poll.question.title,
                image,
                variants,
              }).then(() => Common.addInfoCard('Питання додано'))
            : Poll.updateQuestion({
                id: Poll.question.id,
                type: currentType,
                title: Poll.question.title,
                image,
                variants,
              }).then(() => Common.addInfoCard('Питання змінено'))
          hideHandler()
          return
        }
        case 'open': {
          if (!Poll.question.title) {
            Common.addInfoCard('Введіть питання')
            return
          }

          action === 'add'
            ? Poll.addQuestion({
                id: Date.now(),
                type: currentType,
                title: Poll.question.title,
                image: Poll.question.image,
              }).then(() => Common.addInfoCard('Питання додано'))
            : Poll.updateQuestion({
                id: Poll.question.id,
                type: currentType,
                title: Poll.question.title,
                image: Poll.question.image,
              }).then(() => Common.addInfoCard('Питання змінено'))
          hideHandler()
          return
        }
        case 'scale': {
          const { from, step, to, title, image } = {
            ...Poll.question,
            from: Number(Poll.question.from),
            step: Number(Poll.question.step),
            to: Number(Poll.question.to),
          }
          if (!title) {
            Common.addInfoCard('Введіть питання')
            return
          }
          if (
            (!from && from !== 0) ||
            (!step && step !== 0) ||
            (!to && to !== 0)
          ) {
            Common.addInfoCard('Введіть значення')
            return
          }
          if (from >= to) {
            Common.addInfoCard('Значення "Від" не може бути меншим ніж "До"')
            return
          }
          if (step <= 0 || step > to) {
            Common.addInfoCard('Некоректне значення "Крок"')
            return
          }
          action === 'add'
            ? Poll.addQuestion({
                id: Date.now(),
                type: currentType,
                title: Poll.question.title,
                image,
                from,
                step,
                to,
              }).then(() => Common.addInfoCard('Питання додано'))
            : Poll.updateQuestion({
                id: Poll.question.id,
                type: currentType,
                title: Poll.question.title,
                image,
                from,
                step,
                to,
              }).then(() => Common.addInfoCard('Питання змінено'))
          hideHandler()
          return
        }
      }
    }

    const render = () => {
      switch (currentType) {
        case 'variants':
          return (
            <>
              {Poll.question?.variants?.length ? (
                Poll.question?.variants?.map(({ id, variant }) => (
                  <span className="variant" key={id}>
                    <input
                      type="text"
                      value={variant}
                      onInput={e => Poll.setVariant(id, e.target.value)}
                      placeholder="Введіть варіант"
                    />
                    <FontAwesomeIcon
                      className="remove"
                      icon={faCircleXmark}
                      onClick={() => Poll.removeVariant(id)}
                    />
                  </span>
                ))
              ) : (
                <span className="not-found">Немає варіантів</span>
              )}
              <div
                className="add-variant"
                onClick={() => {
                  if (
                    Poll.question.variants &&
                    !Poll.getVariant().variant.trim().length
                  ) {
                    Common.addInfoCard(
                      'Попередній варіант не може бути порожнім'
                    )
                    return
                  }
                  Poll.setQuestionField({
                    variants: [
                      ...(Poll.question.variants || []),
                      {
                        id: Date.now(),
                        variant: '',
                      },
                    ],
                  })
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} />
                Додати варіант
              </div>
            </>
          )
        case 'open':
          return (
            <p>
              На питання типу <b>"Відкрите"</b> учасник опитування надає свою
              відповідь, яку ви потім зможете побачити у результатах опитування
            </p>
          )
        case 'scale':
          return (
            <>
              <div className="scale" />
              <div className="inputs">
                <Input
                  type="text"
                  pattern={/^\d+\.?\d{0,2}$/}
                  placeholder="Від"
                  value={Poll.question?.from?.toString()}
                  onInput={e =>
                    Poll.setQuestionField({
                      from: e.target.validity.valid
                        ? e.target.value
                        : Poll.question.from === 0
                        ? 0
                        : Poll.question.from || '',
                    })
                  }
                />
                <Input
                  type="text"
                  pattern={/^\d+\.?\d{0,2}$/}
                  placeholder="Крок"
                  value={Poll.question.step}
                  onInput={e =>
                    Poll.setQuestionField({
                      step: e.target.validity.valid
                        ? e.target.value
                        : Poll.question.step || '',
                    })
                  }
                />
                <Input
                  type="text"
                  pattern={/^\d+\.?\d{0,2}$/}
                  placeholder="До"
                  value={Poll.question.to}
                  onInput={e =>
                    Poll.setQuestionField({
                      to: e.target.validity.valid
                        ? e.target.value
                        : Poll.question.to || '',
                    })
                  }
                />
              </div>
            </>
          )
      }
    }

    useEffect(() => {
      const body = document.querySelector('body')
      const html = document.querySelector('html')

      if (show) {
        html.classList.add('poll-modal-open')
        body.classList.add('poll-modal-open')
        setIsShow(true)
        setCurrentType(prev => Poll.question.type || prev)
        return
      }
      setTimeout(() => setIsShow(false), DELAY)
      body.classList.remove('poll-modal-open')
      html.classList.remove('poll-modal-open')
    }, [show])

    return (
      isShow && (
        <>
          <div
            className="add-question-modal-backdrop"
            onClick={hideHandler}
            ref={backdrop}
          ></div>
          <div className="add-question-modal" ref={modal}>
            <Input
              placeholder="Введіть питання"
              value={Poll.question.title}
              onInput={e => Poll.setQuestionField({ title: e.target.value })}
            />
            <div className="img-uploader">
              <label
                id="img-preview"
                htmlFor="upload-input"
                style={{
                  ...(Poll.question.image
                    ? {
                        backgroundImage: `url(${Poll.question.image})`,
                      }
                    : {}),
                }}
              >
                {Poll.question.image ? '' : 'Натисніть, щоб додати'}
              </label>
              <input
                tabIndex="-1"
                id="upload-input"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={async e => {
                  const formData = new FormData()
                  formData.append('image', e.target.files[0])
                  const result = await fetch('https://api.imgur.com/3/image/', {
                    method: 'post',
                    headers: {
                      Authorization: `Client-ID bca78d71abeb154`,
                    },
                    body: formData,
                  })
                    .then(data => data.json())
                    .then(value => value)

                  if (result.success)
                    Poll.setQuestionField({ image: result.data.link })
                }}
              />
            </div>
            <Button onClick={() => Poll.setQuestionField({ image: undefined })}>
              Видалити зображення
            </Button>
            <div className="types">
              {types.map(({ type, label }, idx) => (
                <p
                  className={`link ${currentType === type ? 'active' : ''}`}
                  onClick={() => setCurrentType(type)}
                  key={idx}
                >
                  {label}
                </p>
              ))}
            </div>
            <div className="question-data" id={currentType}>
              {render()}
            </div>
            <Button onClick={() => handler()}>
              {action === 'add' ? 'Додати' : 'Змінити'}
            </Button>
          </div>
        </>
      )
    )
  })
)

export default QuestionModal
