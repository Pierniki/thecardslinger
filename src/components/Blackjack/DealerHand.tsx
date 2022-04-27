import { Dealer, getPossibleCardsValue } from 'engine'
import React from 'react'
import { PlayingCard } from './PlayingCard'

interface Props {
  dealer: Dealer
  showDealerCard: boolean
}

export const DealerHand: React.FC<Props> = ({ dealer, showDealerCard }) => {
  const cardsValue =
    dealer.cards.length > 0
      ? getPossibleCardsValue(
          showDealerCard ? dealer.cards : [dealer.cards[0]],
        ).join('/')
      : null

  return (
    <div className="w-full max-w-md mt-4">
      <div className="flex justify-center mb-3">
        <span className="w-[100px] text-lg font-bold text-stone-200">
          {cardsValue}
        </span>
      </div>
      <div className="flex justify-start gap-2 px-8">
        {dealer.cards.map((card, idx) => {
          return (
            <PlayingCard
              card={card}
              hidden={!showDealerCard && idx !== 0}
              key={card.pip + card.value}
            />
          )
        })}
      </div>
    </div>
  )
}
