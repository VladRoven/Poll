import { inject, observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'
import { CARD_DELAY, CARD_DURATION } from '../../enums/constants'

class Timer {
  constructor(callback, delay) {
    let timerId,
      start,
      remaining = delay

    this.pause = function () {
      window.clearTimeout(timerId)
      timerId = null
      remaining -= Date.now() - start
    }

    this.resume = function () {
      if (timerId) {
        return
      }

      start = Date.now()
      timerId = window.setTimeout(callback, remaining)
    }

    this.resume()
  }
}

const Card = inject('Common')(
  observer(({ Common, text, date }) => {
    const card = useRef()
    const timerHide = useRef()
    const timerRemove = useRef()
    const handlerRemove = () => {
      if (!card.current) return
      card.current.classList.add('hide')
      setTimeout(() => {
        Common.removeInfoCard(date)
      }, CARD_DURATION)
    }

    useEffect(() => {
      setTimeout(() => {
        card.current?.classList?.remove('hide')
      }, 1)
      timerHide.current = new Timer(() => {
        card.current?.classList?.add('hide')
      }, CARD_DELAY - CARD_DURATION)
      timerRemove.current = new Timer(() => {
        if (!card.current) return
        Common.removeInfoCard(date)
      }, CARD_DELAY)
    }, [])

    return (
      <div
        className="card hide"
        ref={card}
        onClick={handlerRemove}
        onMouseEnter={() => {
          timerHide.current.pause()
          timerRemove.current.pause()
        }}
        onMouseLeave={() => {
          timerHide.current.resume()
          timerRemove.current.resume()
        }}
      >
        {text.split('\n').map((_text, idx) => (
          <p key={idx}>
            {_text}
            <br />
          </p>
        ))}
      </div>
    )
  })
)

export default Card
