import { Transition } from '@headlessui/react'
import { Blackjack, getPossibleCardsValue } from 'engine'
import React, { Fragment, useState } from 'react'
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

  const [betSize, setBetSize] = useState<number>(1)

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
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/menu-ornament.png)`,
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
          <div className="w-full">
            <input
              type="range"
              min={1}
              step={1}
              max={money}
              value={betSize}
              onChange={(e) => setBetSize(parseFloat(e.target.value))}
              className="w-full mt-2 mb-4 slider bg-center bg-no-repeat"
            />

            <button
              disabled={!canBet(currentHandIdx)}
              className="px-4 py-2 bg-no-repeat bg-center w-full text-[#b58057] shadow-md transform hover:-translate-y-px duration-100 "
              style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/assets/button.png)`,
                backgroundSize: '100% 100%',
                textShadow: '1px 1px 10px #000000',
              }}
              onClick={() => {
                dispatch(bet({ handIdx: currentHandIdx, bet: betSize }))
                dispatch(removeMoney({ amount: betSize }))
                setBetSize(1)
              }}
            >
              Bet <span className="text-[#eca91f]">{`${betSize}$`}</span>
            </button>
          </div>
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
                  backgroundImage: `url(${process.env.PUBLIC_URL}/assets/button.png)`,
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
                  backgroundImage: `url(${process.env.PUBLIC_URL}/assets/button2.png)`,
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
                  backgroundImage: `url(${process.env.PUBLIC_URL}/assets/button3.png)`,
                  backgroundSize: '100% 100%',
                  textShadow: '1px 1px 10px #000000',
                }}
                onClick={() => {
                  dispatch(doubleDown({ handIdx: currentHandIdx }))
                  dispatch(
                    removeMoney({
                      amount: blackjack.hands[currentHandIdx].bet,
                    }),
                  )
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
                  backgroundImage: `url(${process.env.PUBLIC_URL}/assets/button2.png)`,
                  backgroundSize: '100% 100%',
                  textShadow: '1px 1px 10px #000000',
                }}
                onClick={() => {
                  dispatch(split({ handIdx: currentHandIdx }))
                  dispatch(removeMoney({ amount: betSize }))
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
