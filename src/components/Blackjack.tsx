/* eslint-disable react-hooks/exhaustive-deps */
import { blackjackLoop, getPossibleCardsValue } from 'engine/blackjack'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'state'
import { act, bet, hit, stand } from 'state/blackjackSlice'

interface Props {}

export const Blackjack: React.FC<Props> = (props) => {
  const [money, setMoney] = useState<number>(5)

  const dispatch = useAppDispatch()
  const blackjack = useAppSelector((state) => state.blackjack)

  const canBet = blackjack.state === 'betting'
  const canHit =
    blackjack.state === 'playerTurn' &&
    getPossibleCardsValue(blackjack.hands[0].cards)[0] < 21

  const addMoney = (idx: number, val: number) => setMoney(money + val)

  useEffect(() => {
    const play = async () => {
      const bj = await blackjackLoop(blackjack, addMoney)
      if (!_.isEqual(bj, blackjack)) dispatch(act({ blackjack: bj }))
    }
    play()
  }, [blackjack])

  return (
    <div className="w-full text-center my-16 flex flex-col gap-4 items-center">
      <p>Blackjack</p>
      <code>
        {JSON.stringify({
          cards: blackjack.deck.cards.length,
          graveyard: blackjack.deck.graveyard.length,
        })}
      </code>
      <code>{JSON.stringify({ state: blackjack.state })}</code>
      <div className="my-8">
        <code>
          {JSON.stringify({
            cards: blackjack.dealer.cards.map((card) => card.value),
            handValue: getPossibleCardsValue(blackjack.dealer.cards),
            state: blackjack.dealer.state,
          })}
        </code>
      </div>
      <div className="my-8">
        {blackjack.hands.map((hand) => (
          <div>
            <code>
              {JSON.stringify({
                bet: hand.bet,
                state: hand.state,
                cards: hand.cards.map((card) => card.value),
                handValue: getPossibleCardsValue(hand.cards),
              })}
            </code>
          </div>
        ))}
      </div>
      <div className="flex gap-4 items-center justify-center">
        <h4 className="">{money}</h4>
        <button
          className="border-4 p-2 border-black w-32 disabled:opacity-50"
          onClick={() => {
            dispatch(bet({ handIdx: 0, bet: 1 }))
            setMoney(money - 1)
          }}
          disabled={!canBet}
        >
          bet
        </button>
        <button
          className="border-4 p-2 border-black w-32 disabled:opacity-50"
          onClick={() => dispatch(stand({ handIdx: 0 }))}
          disabled={!canHit}
        >
          stand
        </button>
        <button
          className="border-4 p-2 border-black w-32 disabled:opacity-50"
          onClick={() => dispatch(hit({ handIdx: 0 }))}
          disabled={!canHit}
        >
          hit
        </button>
      </div>
    </div>
  )
}
