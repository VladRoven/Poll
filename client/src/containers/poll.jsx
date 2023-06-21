import { inject, observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import queryString from 'query-string'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/loader'
import Button from '../components/button'
import dayjs from 'dayjs'

const countPercent = (countRespondents, variant, answers) => {
  const variantCount = answers.reduce(
    (acc, { answer }) => acc + (answer === variant.toString() ? 1 : 0),
    0
  )
  return Math.round((variantCount / countRespondents) * 100) || 0
}

const Poll = inject(
  'Common',
  'Poll',
  'User'
)(
  observer(({ Common, Poll, User }) => {
    const navigate = useNavigate()
    const { id } = queryString.parse(location.search)
    const [view, setView] = useState(null)
    const remove = () => {
      Common.showModal({
        text: 'Ви дійсно хочете видалити опитування?',
        btnConfirmTitle: 'Так',
        btnCancelTitle: 'Ні',
        onSubmit: async () =>
          await Poll.remove(id).then(() => {
            navigate('/profile')
            Common.addInfoCard('Опитування видалено')
          }),
      })
    }
    const hide = () => {
      Common.showModal({
        text: 'Ви дійсно хочете приховати опитування та перевести його в статус "В розробці"?',
        btnConfirmTitle: 'Так',
        btnCancelTitle: 'Ні',
        onSubmit: async () =>
          await Poll.update({
            status: 'dev',
            dateClose: null,
            dateOpen: null,
          }).then(() => {
            navigate(`/constructor?id=${id}`)
            Common.addInfoCard('Опитування отримало статус "В розробці"')
          }),
      })
    }
    const close = () => {
      Common.showModal({
        text: 'Ви дійсно хочете завершити опитування?',
        btnConfirmTitle: 'Так',
        btnCancelTitle: 'Ні',
        onSubmit: async () => {
          await Poll.update(
            { status: 'close', dateClose: new Date() },
            Poll.currentPoll.id
          ).then(() => {
            Common.addInfoCard('Опитування завершено')
            Poll.setCurrentPollField({
              status: 'close',
              dateClose: new Date(),
            })
          })
        },
      })
    }
    const open = () => {
      Common.showModal({
        text: 'Ви дійсно хочете розпочати опитування?',
        btnConfirmTitle: 'Так',
        btnCancelTitle: 'Ні',
        onSubmit: async () => {
          await Poll.update(
            { status: 'open', dateOpen: new Date(), dateClose: null },
            Poll.currentPoll.id
          ).then(() => {
            Common.addInfoCard('Опитування розпочато')
            Poll.setCurrentPollField({
              status: 'open',
              dateOpen: new Date(),
              dateClose: null,
            })
          })
        },
      })
    }

    const renderCreator = () => {
      const { respondents, questions, status, dateOpen, dateClose } =
        Poll.currentPoll
      return (
        <>
          <div className="info">
            <p>
              Розпочато: <b>{dayjs(dateOpen).format('DD.MM.YYYY')}</b>
            </p>
            <p>
              Закінчено:{' '}
              <b>
                {dateClose ? dayjs(dateClose).format('DD.MM.YYYY') : 'Триває'}
              </b>
            </p>
            <p>
              Кількість респондентів: <b>{respondents.length}</b>
            </p>
          </div>
          <div className={`questions ${view}`}>
            {questions.map(question => {
              const answers = respondents.length
                ? respondents.reduce((acc, respondent) => {
                    acc.push({
                      user: `${respondent.user.firstName} ${respondent.user.lastName}`,
                      answer: respondent.answers[question.id],
                    })
                    return acc
                  }, [])
                : []
              switch (question.type) {
                case 'variants':
                  return (
                    <div
                      className="question"
                      id="variants"
                      key={question.id}
                      data-aos="fade-zoom-in"
                      data-aos-duration="600"
                    >
                      <h2>{question.title}</h2>
                      {question.image && <img src={question.image} />}
                      <div className="variants">
                        {question.variants.map(variant => (
                          <div className="variant" key={variant.id}>
                            <div
                              className="line"
                              style={{
                                width: `${countPercent(
                                  respondents.length,
                                  variant.id,
                                  answers
                                )}%`,
                              }}
                            />
                            <p className="answer-title">{variant.variant}</p>
                            <p className="answer-percent">
                              {countPercent(
                                respondents.length,
                                variant.id,
                                answers
                              )}
                              %
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                case 'scale':
                  const avg = answers.length
                    ? answers.reduce((acc, { answer }) => acc + answer, 0) /
                      answers.length
                    : 0
                  const { from, to } = question
                  const percent = Math.round(((avg - from) / (to - from)) * 100)
                  return (
                    <div
                      className="question"
                      id="scale"
                      key={question.id}
                      data-aos="fade-zoom-in"
                      data-aos-duration="600"
                    >
                      <h2>{question.title}</h2>
                      {question.image && <img src={question.image} />}
                      <div className="scale">
                        <p title="Від">{from}</p>
                        <div className="line">
                          <div
                            title={`Середня відповідь: ${avg}`}
                            className="slider"
                            style={{
                              left: `${percent >= 0 ? percent : 0}%`,
                              transform: `translateX(-${
                                percent >= 0 ? percent : 0
                              }%)`,
                            }}
                          />
                        </div>
                        <p title="До">{to}</p>
                      </div>
                      <div className="answers">
                        {answers.length ? (
                          answers.map(({ user, answer }, idx) => (
                            <div className="answer" key={idx}>
                              <p>
                                <b>{user}</b> вказав(-ла) відмітку:{' '}
                                <b>{answer}</b>
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="empty">
                            <p>Немає жодної відповіді</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                case 'open':
                  return (
                    <div
                      className="question"
                      id="open"
                      key={question.id}
                      data-aos="fade-zoom-in"
                      data-aos-duration="600"
                    >
                      <h2>{question.title}</h2>
                      {question.image && <img src={question.image} />}
                      <div className="answers">
                        {answers.length ? (
                          answers.map(({ user, answer }, idx) => (
                            <div className="answer" key={idx}>
                              <p className="open-name">{user}</p>
                              <p className="open-answer">{answer}</p>
                            </div>
                          ))
                        ) : (
                          <div className="empty">
                            <p>Немає жодної відповіді</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
              }
            })}
          </div>
          <div className="buttons">
            <Button onClick={() => remove()}>Видалити</Button>
            <Button onClick={() => hide()}>Редагувати</Button>
            <Button onClick={() => (status === 'open' ? close() : open())}>
              {status === 'open' ? 'Закрити' : 'Відкрити'}
            </Button>
            <Button>Звіт</Button>
          </div>
        </>
      )
    }
    const renderRespondent = () => {
      return (
        <>
          <div className={`questions ${view}`}></div>
          <div className="buttons">
            <Button>Завершити</Button>
          </div>
        </>
      )
    }

    useEffect(() => {
      Poll.loadPoll(id)
    }, [])

    useEffect(() => {
      if (Poll.actualRequests.get) return
      if (!Poll.actualRequests.get && !Poll.currentPoll) {
        navigate('/profile')
        return
      }
      if (!Poll.currentPoll) {
        navigate('/profile')
        return
      }
      if (Poll.currentPoll.user) {
        setView('creator')
        return
      }
      setView('respondent')
    }, [Poll.actualRequests.get])

    return Poll.actualRequests.get || !Poll.currentPoll ? (
      <Loader />
    ) : (
      <>
        <Header />
        <div className="container" id="poll-page">
          <h2 className="title">{Poll.currentPoll.title}</h2>
          {view === 'creator' ? renderCreator() : renderRespondent()}
        </div>
        <Footer />
      </>
    )
  })
)

export default Poll
