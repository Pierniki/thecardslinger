import { Card } from 'engine/common'
import React from 'react'

interface Props {
  card: Card
  hidden?: boolean
  disableTransform?: boolean
  elevated?: boolean
}

const color = '#715f4d'
const cardsPath = `${process.env.PUBLIC_URL}/assets/cards`

export const PlayingCard: React.FC<Props> = ({
  card,
  hidden,
  disableTransform,
}) => {
  return (
    <div
      className={` h-20 font-card w-14 relative flex items-center bg-center bg-cover justify-center transform font-bold text-lg`}
      style={{
        backgroundImage: hidden
          ? `url(${cardsPath}/card_back_1${
              card.marked ? `_marked_${markMap[card.marked]}` : ''
            }.png)`
          : `url(${cardsPath}/card${
              card.marked ? `_marked_${markMap[card.marked]}` : ''
            }.png)`,
        transform: disableTransform ? undefined : card.transform,
        color: color,
      }}
    >
      {!hidden && (
        <>
          <span className="absolute left-2 top-0">{valueMap[card.value]}</span>
          <img
            src={`${cardsPath}/${card.pip}.png`}
            alt={card.pip}
            className="w-[25px] h-[25px]"
            draggable="false"
          />
          <span className="absolute right-2 bottom-0">
            {valueMap[card.value]}
          </span>
        </>
      )}
    </div>
  )
}

const markMap = {
  obvious: '1',
  'semi-obvious': '2',
  sneaky: '3',
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
