import { getPossibleCardsValue, Hand } from 'engine'
import React from 'react'
import { PlayingCard } from './PlayingCard'

interface Props {
  hand: Hand
  hideValues?: boolean
}

export const PlayerHand: React.FC<Props> = ({ hand, hideValues }) => {
  const cardsValue =
    hand.cards.length > 0 ? getPossibleCardsValue(hand.cards).join('/') : null

  return (
    <div className="inline-block pt-16">
      <div className=" inline-block relative -ml-12">
        {hand.cards[0] && <PlayingCard card={hand.cards[0]} />}
        {hand.cards.map((card, idx) => {
          if (idx === 0) return null
          return (
            <div
              key={card.pip + card.value}
              className="absolute"
              style={{
                left: `${idx * 20}px`,
                bottom: `${idx * 18}px`,
              }}
            >
              <PlayingCard card={card} />
            </div>
          )
        })}
      </div>
      <div className="flex justify-center mt-3">
        <span className="w-[100px] text-lg font-bold text-stone-200">
          {!hideValues ? cardsValue : ''}
        </span>
      </div>
    </div>
  )
}
