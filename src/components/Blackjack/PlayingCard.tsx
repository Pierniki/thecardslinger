import { Card } from 'engine/common'
import React from 'react'

interface Props {
  card: Card
  hidden?: boolean
}

const color = '#715f4d'
const cardsPath = '/assets/cards'

export const PlayingCard: React.FC<Props> = ({ card, hidden }) => {
  return (
    <div
      className={`h-24 font-card w-16 relative flex items-center bg-center bg-cover justify-center transform font-bold text-lg`}
      style={{
        backgroundImage: hidden
          ? `url(${cardsPath}/card_back_1.png)`
          : `url(${cardsPath}/card.png)`,
        transform: card.transform,
        color: color,
      }}
    >
      {!hidden && (
        <>
          <span className="absolute left-2 top-0">{valueMap[card.value]}</span>
          <img
            src={`${cardsPath}/${card.pip}.png`}
            alt={card.pip}
            className="w-[30px] h-[30px]"
          />
          <span className="absolute right-2 bottom-0">
            {valueMap[card.value]}
          </span>
        </>
      )}
    </div>
  )
}

const valueMap = {
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  jack: 'J',
  queen: 'Q',
  king: 'K',
  ace: 'A',
}
