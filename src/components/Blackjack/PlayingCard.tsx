import { Card } from 'engine/common'
import React from 'react'

interface Props {
  card: Card
  hidden?: boolean
}

const color = '#715f4d'

export const PlayingCard: React.FC<Props> = ({ card, hidden }) => {
  return (
    <div
      className={`h-24 font-card w-16 relative flex items-center bg-center bg-cover justify-center transform font-bold text-lg`}
      style={{
        backgroundImage: 'url(/assets/card.png)',
        transform: card.transform,
        color: color,
      }}
    >
      {!hidden && (
        <>
          <div className="absolute left-2 top-6 text-xs h-3 w-3 bg-center bg-cover">
            {pipMap[card.pip]}
          </div>
          <span className="absolute left-2 top-0">{valueMap[card.value]}</span>
          <span className="absolute right-2 bottom-0">
            {valueMap[card.value]}
          </span>
          <div className="absolute right-2 bottom-6 text-xs h-3 w-3 bg-center bg-cover">
            {pipMap[card.pip]}
          </div>
        </>
      )}
    </div>
  )
}

const pipMap = {
  clubs: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -0.5 7 7"
      shape-rendering="crispEdges"
    >
      <path
        stroke="#222034"
        d="M3 0h1M2 1h3M1 2h1M3 2h1M5 2h1M0 3h7M1 4h1M3 4h1M5 4h1M3 5h1M2 6h3"
      />
    </svg>
  ),
  diamonds: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -0.5 5 5"
      shape-rendering="crispEdges"
    >
      <path stroke="#ac3232" d="M2 0h1M1 1h3M1 2h3M1 3h3M2 4h1" />
    </svg>
  ),
  hearts: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -0.5 5 5"
      shape-rendering="crispEdges"
    >
      <path stroke="#ac3232" d="M1 0h1M3 0h1M0 1h5M0 2h5M1 3h3M2 4h1" />
    </svg>
  ),
  spades: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -0.5 5 5"
      shape-rendering="crispEdges"
    >
      <path stroke="#222034" d="M2 0h1M1 1h3M1 2h3M2 3h1M1 4h3" />
    </svg>
  ),
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
