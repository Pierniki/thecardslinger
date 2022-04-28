/* eslint-disable react-hooks/exhaustive-deps */
import { blackjackLoop } from 'engine/blackjack'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'state'
import { act } from 'state/blackjackSlice'
import { addMoney } from 'state/playerSlice'
import { Actions } from './Actions'
import { DealerHand } from './DealerHand'
import { PlayersHands } from './PlayersHands'

interface Props {}

export const Blackjack: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch()
  const blackjack = useAppSelector((state) => state.blackjack)
  const money = useAppSelector((state) => state.player.money)
  const [currentHand, setCurrentHand] = useState<number>(0)

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
    <>
      <div className="flex flex-1 flex-col justify-between items-center text-center">
        <DealerHand
          dealer={blackjack.dealer}
          showDealerCard={showDealerCard}
          deck={blackjack.deck}
        />
        <PlayersHands
          hands={blackjack.hands}
          currentHand={currentHand}
          setCurrentHand={setCurrentHand}
        />
      </div>
      <Actions
        blackjack={blackjack}
        money={money}
        currentHandIdx={currentHand}
      />
    </>
  )
}
