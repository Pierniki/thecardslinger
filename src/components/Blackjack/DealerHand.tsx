import { Dealer, getPossibleCardsValue } from 'engine'
import { Deck } from 'engine/common'
import React from 'react'
import { PlayingCard } from './PlayingCard'

interface Props {
  dealer: Dealer
  showDealerCard: boolean
  deck: Deck
}

export const DealerHand: React.FC<Props> = ({
  dealer,
  showDealerCard,
  deck,
}) => {
  const cardsValue =
    dealer.cards.length > 0
      ? getPossibleCardsValue(
          showDealerCard ? dealer.cards : [dealer.cards[0]],
        ).join('/')
      : null

  const deckBgColor = '#2b293e'
  const deckStackSize = Math.floor(deck.cards.length / 10)
  const deckBoxShadow = Array.from(Array(deckStackSize))
    .map((val, idx) => `${idx + 1}px ${idx + 1}px 0px ${deckBgColor}`)
    .join(', ')

  return (
    <div className="w-full max-w-md mt-4">
      <div className="flex justify-center mb-3">
        <span className="w-[100px] text-lg font-bold text-stone-200 min-h-[28px]">
          {cardsValue}
        </span>
      </div>
      <div className="flex justify-start px-8">
        <div
          className="mr-8 rounded-lg relative flex justify-center items-center"
          style={{
            transform: `translate(-${deckStackSize}px, -${deckStackSize}px)`,
            backgroundColor: deckBgColor,
            boxShadow: deckBoxShadow,
          }}
        >
          {deck.cards.length > 0 && (
            <>
              <div className="absolute z-20 text-stone-400">
                {deck.cards.length}
              </div>
              <PlayingCard
                card={deck.cards[deck.cards.length - 1]}
                hidden={true}
                disableTransform={true}
              />
            </>
          )}
        </div>

        {dealer.cards.map((card, idx) => {
          return (
            <div className="-ml-2" key={'dealer-card' + card.pip + card.value}>
              <PlayingCard
                card={card}
                hidden={!showDealerCard && idx !== 0}
                key={card.pip + card.value}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
