/* eslint-disable react-hooks/exhaustive-deps */
import { blackjackLoop, getPossibleCardsValue } from 'engine/blackjack'
import _ from 'lodash'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'state'
import { act, bet, doubleDown, hit, stand } from 'state/blackjackSlice'
import { addMoney, removeMoney } from 'state/playerSlice'

interface Props {}

export const Blackjack: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch()
  const blackjack = useAppSelector((state) => state.blackjack)
  const money = useAppSelector((state) => state.player.money)

  const canBet = (handIdx: number) =>
    blackjack.state === 'betting' && blackjack.hands[handIdx].bet === 0
  const canHit = (handIdx: number) =>
    blackjack.state === 'playerTurn' &&
    blackjack.hands[handIdx].state !== 'standing' &&
    getPossibleCardsValue(blackjack.hands[handIdx].cards)[0] < 21
  const canDD = (handIdx: number) =>
    canHit(handIdx) &&
    money > blackjack.hands[handIdx].bet &&
    blackjack.hands[handIdx].cards.length === 1
  const showDealerCard =
    blackjack.state === 'dealerTurn' || blackjack.state === 'payout'

  const awardWinnings = (idx: number, val: number) =>
    dispatch(addMoney({ amount: val }))

  useEffect(() => {
    const play = async () => {
      const bj = await blackjackLoop(blackjack, awardWinnings)
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

      <div className="w-full max-w-sm h-32 flex justify-start gap-8">
        <h4 className="text-lg">{money}</h4>
      </div>
      <div className="w-full max-w-sm  flex justify-center items-center gap-8 mb-16">
        <div className="absolute mr-48">
          {blackjack.dealer.cards.length > 0 && (
            <span
              className="text-4xl"
              style={{
                color: blackjack.dealer.state === 'bust' ? 'red' : '',
              }}
            >
              {getPossibleCardsValue(
                showDealerCard
                  ? blackjack.dealer.cards
                  : [blackjack.dealer.cards[0]],
              ).join('/')}
            </span>
          )}
        </div>
        <div className="block relative h-24 w-16">
          {blackjack.dealer.cards.map((card, idx) => {
            return (
              <div
                className={`border-2 border-black h-24 w-16 absolute flex items-center justify-center bg-white`}
                style={{
                  translate: idx * 30,
                  backgroundColor:
                    showDealerCard || idx === 0 ? '' : 'slategrey',
                }}
              >
                {(showDealerCard || idx === 0) && (
                  <>
                    <span className="absolute left-2 top-2 text-xs">
                      {valueMap[card.value]}
                    </span>
                    <span className="absolute right-2 bottom-2 text-xs">
                      {valueMap[card.value]}
                    </span>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="w-full flex justify-center items-start gap-8 relative">
        {blackjack.hands.map((hand, idx) => {
          return (
            <div className="flex flex-col gap-4">
              <div className="mr-48">
                {hand.cards.length > 0 && (
                  <span
                    className="text-4xl"
                    style={{
                      color: hand.state === 'bust' ? 'red' : '',
                    }}
                  >
                    {getPossibleCardsValue(hand.cards).join('/')}
                  </span>
                )}
              </div>
              <div className="block relative h-24 w-16">
                {hand.cards.map((card, idx) => {
                  return (
                    <div
                      className={`border-2 border-black h-24 w-16 absolute flex items-center justify-center bg-white`}
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
              {canBet(idx) && (
                <button
                  className="border-4 p-2 border-black disabled:opacity-50 text-xs"
                  onClick={() => {
                    dispatch(bet({ handIdx: idx, bet: 1 }))
                    dispatch(removeMoney({ amount: 1 }))
                  }}
                >
                  bet
                </button>
              )}
              {canHit(idx) && (
                <button
                  className="border-4 p-2 border-black disabled:opacity-50 text-xs"
                  onClick={() => dispatch(stand({ handIdx: idx }))}
                >
                  stand
                </button>
              )}
              {canHit(idx) && (
                <button
                  className="border-4 p-2 border-black  disabled:opacity-50 text-xs"
                  onClick={() => dispatch(hit({ handIdx: idx }))}
                >
                  hit
                </button>
              )}
              {canDD(idx) && (
                <button
                  className="border-4 p-2 border-black  disabled:opacity-50 text-xs"
                  onClick={() => {
                    dispatch(doubleDown({ handIdx: idx }))
                    dispatch(removeMoney({ amount: 1 }))
                  }}
                >
                  DD
                </button>
              )}
            </div>
          )
        })}
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
