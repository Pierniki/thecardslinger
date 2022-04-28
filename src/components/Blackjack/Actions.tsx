import { Transition } from '@headlessui/react'
import { Blackjack, getPossibleCardsValue } from 'engine'
import React, { Fragment } from 'react'
import { useAppDispatch } from 'state'
import { bet, doubleDown, hit, split, stand } from 'state/blackjackSlice'
import { removeMoney } from 'state/playerSlice'

interface Props {
  blackjack: Blackjack
  money: number
  currentHandIdx: number
}

export const Actions: React.FC<Props> = ({
  blackjack,
  money,
  currentHandIdx,
}) => {
  const dispatch = useAppDispatch()

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
  const canSplit = (handIdx: number) =>
    canDD(handIdx) &&
    blackjack.hands[handIdx].cards[0].value ===
      blackjack.hands[handIdx].cards[1].value

  return (
    <div className=" h-[150px] bg-[#0f0b1c] mt-8  font-card  w-full relative pt-1">
      <div
        style={{
          backgroundImage: 'url(/assets/menu-ornament.png)',
          backgroundSize: '100% 100%',
        }}
        className="absolute -top-4 h-4 w-full"
      />
      <div className="max-w-md mx-auto  w-full flex flex-col items-center justify-start gap-1  overflow-x-hidden pt-1">
        <Transition
          show={blackjack.state === 'betting'}
          as={Fragment}
          enter="transform transition duration-200"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition duration-200"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <button
            disabled={!canBet(currentHandIdx)}
            className="px-4 py-2 bg-no-repeat bg-center w-full text-[#b58057] shadow-md transform hover:-translate-y-px duration-100 -mt-1 "
            style={{
              backgroundImage: 'url(/assets/button.png)',
              backgroundSize: '100% 100%',
              textShadow: '1px 1px 10px #000000',
            }}
            onClick={() => {
              dispatch(bet({ handIdx: currentHandIdx, bet: 1 }))
              dispatch(removeMoney({ amount: 1 }))
            }}
          >
            Bet <span className="text-[#eca91f]">1$</span>
          </button>
        </Transition>
        {blackjack.state !== 'betting' && (
          <>
            <Transition
              show={canHit(currentHandIdx)}
              as={Fragment}
              enter="transform transition duration-150"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition duration-200"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <button
                disabled={!canHit(currentHandIdx)}
                className="px-4 py-1 bg-no-repeat bg-center w-full text-[#b58057] shadow-md transform hover:-translate-y-px duration-200 -mt-1"
                style={{
                  backgroundImage: 'url(/assets/button.png)',
                  backgroundSize: '100% 100%',
                  textShadow: '1px 1px 10px #000000',
                }}
                onClick={() => dispatch(hit({ handIdx: currentHandIdx }))}
              >
                Hit
              </button>
            </Transition>
            <Transition
              show={canHit(currentHandIdx)}
              as={Fragment}
              enter="transform transition duration-200"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition duration-150"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <button
                disabled={!canHit(currentHandIdx)}
                className="px-4 py-1 bg-no-repeat bg-center w-full text-[#b58057] shadow-md transform hover:-translate-y-px duration-200"
                style={{
                  backgroundImage: 'url(/assets/button2.png)',
                  backgroundSize: '100% 100%',
                  textShadow: '1px 1px 10px #000000',
                }}
                onClick={() => dispatch(stand({ handIdx: currentHandIdx }))}
              >
                Stand
              </button>
            </Transition>

            <Transition
              show={canDD(currentHandIdx)}
              as={Fragment}
              enter="transform transition duration-150"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition duration-150"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <button
                disabled={!canDD(currentHandIdx)}
                className="px-4 py-1 bg-no-repeat bg-center w-full text-[#b58057] shadow-md transform hover:-translate-y-px duration-200"
                style={{
                  backgroundImage: 'url(/assets/button3.png)',
                  backgroundSize: '100% 100%',
                  textShadow: '1px 1px 10px #000000',
                }}
                onClick={() => {
                  dispatch(doubleDown({ handIdx: currentHandIdx }))
                  dispatch(removeMoney({ amount: 1 }))
                }}
              >
                Double down
              </button>
            </Transition>
            <Transition
              show={canSplit(currentHandIdx)}
              as={Fragment}
              enter="transform transition duration-200"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition duration-200"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <button
                disabled={!canSplit(currentHandIdx)}
                className="px-4 py-1 bg-no-repeat bg-center w-full text-[#b58057] shadow-md transform hover:-translate-y-px duration-200"
                style={{
                  backgroundImage: 'url(/assets/button2.png)',
                  backgroundSize: '100% 100%',
                  textShadow: '1px 1px 10px #000000',
                }}
                onClick={() => {
                  dispatch(split({ handIdx: currentHandIdx }))
                  dispatch(removeMoney({ amount: 1 }))
                }}
              >
                Split
              </button>
            </Transition>
          </>
        )}
      </div>
    </div>
  )
}
