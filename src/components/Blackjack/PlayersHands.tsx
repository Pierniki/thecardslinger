import { Hand } from 'engine'
import React from 'react'
import { PlayerHand } from './PlayerHand'

interface Props {
  hands: Hand[]
  currentHand: number
  setCurrentHand: (idx: number) => void
}

export const PlayersHands: React.FC<Props> = ({
  hands,
  currentHand,
  setCurrentHand,
}) => {
  return (
    <div className="w-full flex justify-center items-end overflow-x-hidden flex-1">
      <div
        className="absolute -left-[60px] transition  hover:scale-110 grayscale hover:grayscale-0 cursor-pointer"
        onClick={() => setCurrentHand(currentHand - 1)}
      >
        {hands[currentHand - 1] && (
          <PlayerHand hand={hands[currentHand - 1]} hideValues />
        )}
      </div>
      {hands[currentHand] && <PlayerHand hand={hands[currentHand]} />}
      <div
        className="absolute -right-[75px] transition  hover:scale-110 grayscale hover:grayscale-0 cursor-pointer"
        onClick={() => setCurrentHand(currentHand + 1)}
      >
        {hands[currentHand + 1] && (
          <PlayerHand hand={hands[currentHand + 1]} hideValues />
        )}
      </div>
    </div>
  )
}
