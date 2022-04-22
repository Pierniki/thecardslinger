import { Card, shuffleDeck } from 'engine/common'
import _ from 'lodash'
import { Blackjack } from './blackjack'
import { getPossibleCardsValue } from './utility'

export const hitAction = (
  old: Blackjack,
  action: { payload: { handIdx: number } },
): Blackjack => {
  const state = _.cloneDeep(old)
  const handIdx = action.payload.handIdx

  if (state.deck.cards.length <= 0) state.deck = shuffleDeck(state.deck)
  const topCard = state.deck.cards.pop() as Card
  state.hands[handIdx].cards.push(topCard)

  const cardsValue = getPossibleCardsValue(state.hands[handIdx].cards)
  if (cardsValue.some((val) => val === 21))
    state.hands[handIdx].state = 'standing'
  if (cardsValue[0] > 21) state.hands[handIdx].state = 'bust'
  return state
}

export const standAction = (
  old: Blackjack,
  action: { payload: { handIdx: number } },
) => {
  const state = _.cloneDeep(old)
  const handIdx = action.payload.handIdx
  state.hands[handIdx].state = 'standing'
  return state
}

export const betAction = (
  old: Blackjack,
  action: { payload: { handIdx: number; bet: number } },
): Blackjack => {
  const state = _.cloneDeep(old)
  state.hands[action.payload.handIdx].bet = action.payload.bet
  return state
}
