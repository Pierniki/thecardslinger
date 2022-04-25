/* eslint-disable react-hooks/exhaustive-deps */
import { blackjackLoop, getPossibleCardsValue } from 'engine/blackjack'
import _ from 'lodash'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'state'
import { act, bet, doubleDown, hit, split, stand } from 'state/blackjackSlice'
import { addMoney, removeMoney } from 'state/playerSlice'
import { MoneyDisplay } from '../MoneyDisplay'
import { PlayingCard } from './PlayingCard'

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
    blackjack.hands[handIdx].cards.length === 2
  const showDealerCard =
    blackjack.state === 'dealerTurn' || blackjack.state === 'payout'
  const canSplit = (handIdx: number) =>
    canDD(handIdx) &&
    blackjack.hands[handIdx].cards[0].value ===
      blackjack.hands[handIdx].cards[1].value

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
      <div className="w-full max-w-sm  flex justify-center items-start gap-8 relative mb-8">
        <div className="absolute left-0 ">
          <MoneyDisplay money={money} />
        </div>
        <p className="text-lg">Blackjack</p>
      </div>
      <div className="w-full max-w-sm  flex justify-center items-center gap-8 mb-8">
        <div className="absolute mr-48">
          {blackjack.dealer.cards.length > 0 && (
            <span
              className="text-xl"
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
                className="absolute"
                style={{
                  right: `-${idx * 75}px`,
                }}
              >
                <PlayingCard
                  card={card}
                  hidden={!showDealerCard && idx !== 0}
                />
              </div>
            )
          })}
        </div>
      </div>
      <div className="w-full flex justify-center items-start gap-44 relative">
        {blackjack.hands.map((hand, idx) => {
          return (
            <div className="flex flex-col gap-8 items-center mt-16">
              <div className="absolute top-0">
                {hand.cards.length > 0 && (
                  <span
                    className="text-xl"
                    style={{
                      color: hand.state === 'bust' ? 'red' : '',
                    }}
                  >
                    {getPossibleCardsValue(hand.cards).join('/')}
                  </span>
                )}
              </div>
              <div className="relative h-24 w-16 flex items-center">
                {hand.bet !== 0 && hand.state !== 'bust' && (
                  <span
                    className="absolute  text-yellow-600 z-10 text-lg"
                    style={{ left: '-35px', lineHeight: '40px' }}
                  >
                    {`${hand.bet}$`}
                  </span>
                )}
                {hand.cards.map((card, idx) => {
                  return (
                    <div
                      className="absolute"
                      style={{ right: `-${idx * 25}px` }}
                    >
                      <PlayingCard card={card} />
                    </div>
                  )
                })}
              </div>
              <div className="flex flex-col gap-2">
                {canBet(idx) && (
                  <button
                    className="border-4 p-2 border-black disabled:opacity-50 text-xs"
                    onClick={() => {
                      dispatch(bet({ handIdx: idx, bet: 1 }))
                      dispatch(removeMoney({ amount: 1 }))
                    }}
                  >
                    bet
                    <span className=" text-yellow-600 ml-2">1$</span>
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
                {canSplit(idx) && (
                  <button
                    className="border-4 p-2 border-black  disabled:opacity-50 text-xs"
                    onClick={() => {
                      dispatch(split({ handIdx: idx }))
                      dispatch(removeMoney({ amount: 1 }))
                    }}
                  >
                    Split
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
