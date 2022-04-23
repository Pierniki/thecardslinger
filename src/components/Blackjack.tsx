/* eslint-disable react-hooks/exhaustive-deps */
import { blackjackLoop, getPossibleCardsValue } from 'engine/blackjack'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'state'
import { act, bet, doubleDown, hit, stand } from 'state/blackjackSlice'

interface Props {}

export const Blackjack: React.FC<Props> = (props) => {
  const [money, setMoney] = useState<number>(5)

  const dispatch = useAppDispatch()
  const blackjack = useAppSelector((state) => state.blackjack)

  const canBet = blackjack.state === 'betting'
  const canHit =
    blackjack.state === 'playerTurn' &&
    getPossibleCardsValue(blackjack.hands[0].cards)[0] < 21
  const canDD =
    canHit &&
    money > blackjack.hands[0].bet &&
    blackjack.hands[0].cards.length === 1
  const showDealerCard =
    blackjack.state === 'dealerTurn' || blackjack.state === 'payout'

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

      <div className="w-full max-w-sm">
        <div className="h-40 flex justify-center items-center relative">
          {blackjack.dealer.cards.length > 0 && (
            <span
              className="left-0 text-4xl absolute"
              style={{ color: blackjack.dealer.state === 'bust' ? 'red' : '' }}
            >
              {getPossibleCardsValue(
                showDealerCard
                  ? blackjack.dealer.cards
                  : [blackjack.dealer.cards[0]],
              ).join('/')}
            </span>
          )}
          {blackjack.dealer.cards.map((card, idx) => {
            return (
              <div
                className={`border-2 border-black h-24 w-16  absolute flex items-center justify-center bg-white transform translate-x-${idx} translate-y-${idx}`}
                style={{
                  translate: idx * 30,
                  backgroundColor:
                    showDealerCard || idx === 0 ? '' : 'slategrey',
                }}
              >
                {(showDealerCard || idx === 0) && (
                  <>
                    <span className="absolute left-1 top-1 text-xs">
                      {pipMap[card.pip]}
                    </span>
                    <span className="absolute left-2 top-5 text-xs">
                      {valueMap[card.value]}
                    </span>
                    <span className="absolute right-2 bottom-5 text-xs">
                      {valueMap[card.value]}
                    </span>
                    <span className="absolute right-1 bottom-1 text-xs">
                      {pipMap[card.pip]}
                    </span>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="my-8 w-full max-w-sm">
        <div className="h-40 flex justify-center items-center relative">
          {blackjack.hands[0].cards.length > 0 && (
            <span
              className="left-0 text-4xl absolute"
              style={{
                color: blackjack.hands[0].state === 'bust' ? 'red' : '',
              }}
            >
              {getPossibleCardsValue(blackjack.hands[0].cards).join('/')}
            </span>
          )}
          {blackjack.hands[0].cards.map((card, idx) => {
            return (
              <div
                className={`border-2 border-black h-24 w-16  absolute flex items-center justify-center bg-white transform translate-x-${idx} translate-y-${idx}`}
                style={{ translate: idx * 30 }}
              >
                <span className="absolute left-1 top-1 text-xs">
                  {pipMap[card.pip]}
                </span>
                <span className="absolute left-2 top-5 text-xs">
                  {valueMap[card.value]}
                </span>
                <span className="absolute right-2 bottom-5 text-xs">
                  {valueMap[card.value]}
                </span>
                <span className="absolute right-1 bottom-1 text-xs">
                  {pipMap[card.pip]}
                </span>
              </div>
            )
          })}
        </div>
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
        <button
          className="border-4 p-2 border-black w-32 disabled:opacity-50"
          onClick={() => {
            dispatch(doubleDown({ handIdx: 0 }))
            setMoney(money - 1)
          }}
          disabled={!canDD}
        >
          DD
        </button>
      </div>
    </div>
  )
}

const pipMap = {
  clubs: '♣️',
  diamonds: '♦️',
  hearts: '♥️',
  spades: '♠️',
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
