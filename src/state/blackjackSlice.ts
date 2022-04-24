import { createSlice } from '@reduxjs/toolkit'
import {
  betAction,
  Blackjack,
  createNewHand,
  doubleDownAction,
  hitAction,
  splitAction,
  standAction,
} from 'engine/blackjack'
import { createNewDeck, shuffleDeck } from 'engine/common'

const initialState: Blackjack = {
  state: 'betting',
  deck: shuffleDeck(createNewDeck()),
  dealer: { cards: [], state: 'waiting' },
  hands: [createNewHand(0)],
}

export const blackjackSlice = createSlice({
  name: 'blackjack',
  initialState,
  reducers: {
    bet: betAction,
    hit: hitAction,
    stand: standAction,
    doubleDown: doubleDownAction,
    split: splitAction,
    act: (
      blackjack: Blackjack,
      action: { payload: { blackjack: Blackjack } },
    ) => action.payload.blackjack,
  },
})

export const {
  bet,
  hit,
  stand,
  act,
  doubleDown,
  split,
} = blackjackSlice.actions
export default blackjackSlice.reducer
