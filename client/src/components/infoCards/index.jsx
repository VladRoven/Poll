import { inject, observer } from 'mobx-react'
import React from 'react'
import './style'
import Card from './card'

const InfoCards = inject('Common')(
  observer(({ Common }) => {
    return (
      <div className="poll-info-cards">
        {Common.infoCards.map(card => (
          <Card text={card.text} date={card.date} key={card.date} />
        ))}
      </div>
    )
  })
)

export default InfoCards
