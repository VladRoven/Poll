import { inject, observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import queryString from 'query-string'
import Button from '../components/button'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/loader'
import {
  faCirclePlus,
  faPenToSquare,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import QuestionModal from '../components/questionModal'

const Constructor = inject(
  'Common',
  'Poll',
  'User'
)(
  observer(({ Common, Poll, User, ...props }) => {
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [action, setAction] = useState('add')
    const { id } = queryString.parse(location.search)
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
    const publish = () => {
      Common.showModal({
        text: 'Ви дійсно хочете опублікувати опитування?',
        btnConfirmTitle: 'Так',
        btnCancelTitle: 'Ні',
        onSubmit: async () => {
          if (!Poll.currentPoll || !Poll.currentPoll.questions.length) {
            Common.addInfoCard('Опитування не може бути порожнім')
            return
          }
          await Poll.update(
            { status: 'open', dateOpen: new Date() },
            Poll.currentPoll.id
          ).then(() => {
            Common.addInfoCard('Опитування опубліковано')
            navigate('/profile')
          })
        },
      })
    }
    const removeQuestion = id => {
      Common.showModal({
        text: 'Ви дійсно хочете видалити питання?',
        btnConfirmTitle: 'Так',
        btnCancelTitle: 'Ні',
        onSubmit: async () =>
          await Poll.removeQuestion(id).then(() => {
            Common.addInfoCard('Питання видалено')
          }),
      })
    }
    const renderQuestion = question => {
      switch (question.type) {
        case 'variants':
          return question?.variants?.map(({ id, variant }) => (
            <span className="variant" key={id}>
              <p>{variant}</p>
            </span>
          ))
        case 'open':
          return (
            <p>
              Це питання відкритого типу. В результатах опитування Ви будете
              бачити власну відповідь учасника.
            </p>
          )
        case 'scale':
          return (
            <>
              <div className="scale" />
              <div className="inputs">
                <p>Від: {question.from}</p>
                <p>Крок: {question.step}</p>
                <p>До: {question.to}</p>
              </div>
            </>
          )
      }
    }

    useEffect(() => {
      Poll.loadPoll(id)
    }, [])

    useEffect(() => {
      if (!Poll.actualRequests.get && !Poll.currentPoll) navigate('/profile')
    }, [Poll.actualRequests.get])

    return Poll.actualRequests.get || !Poll.currentPoll ? (
      <Loader />
    ) : (
      <>
        <QuestionModal
          action={action}
          setAction={setAction}
          show={show}
          onHide={() => setShow(false)}
        />
        <Header />
        <div className="container" id="constructor-page">
          <h2 className="title">{Poll.currentPoll.title}</h2>
          <div className="questions">
            {Poll.currentPoll.questions?.length ? (
              <>
                {Poll.currentPoll.questions.map(question => (
                  <div
                    className="question"
                    id={question.type}
                    key={question.id}
                    data-aos="fade-zoom-in"
                    data-aos-duration="600"
                  >
                    <div className="header">
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        onClick={() => removeQuestion(question.id)}
                      />
                      <h2>{question.title}</h2>
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        onClick={() => {
                          Poll.setQuestion(Poll.getQuestion(question.id))
                          setAction('edit')
                          setShow(true)
                        }}
                      />
                    </div>
                    {question.image && (
                      <img src={question.image} alt="Зображення" />
                    )}
                    <div className="body">{renderQuestion(question)}</div>
                  </div>
                ))}
                <div className="add-question" onClick={() => setShow(true)}>
                  <FontAwesomeIcon icon={faCirclePlus} />
                  Додати питання
                </div>
              </>
            ) : (
              <div className="not-found">
                Питань немає
                <div className="add-question" onClick={() => setShow(true)}>
                  <FontAwesomeIcon icon={faCirclePlus} />
                  Додати питання
                </div>
              </div>
            )}
          </div>
          <div className="buttons">
            <Button onClick={() => publish()}>Опублікувати</Button>
            <Button onClick={() => remove()}>Видалити</Button>
          </div>
        </div>
        <Footer />
      </>
    )
  })
)

export default Constructor
