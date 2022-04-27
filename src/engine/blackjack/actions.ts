import { Card, drawCards, shuffleDeck } from 'engine/common'
import _ from 'lodash'
import { Blackjack } from './blackjack'
import { createNewHand, getActualCardsValue } from './utility'

export const hitAction = (
  old: Blackjack,
  action: { payload: { handIdx: number } },
): Blackjack => {
  const state = _.cloneDeep(old)
  const handIdx = action.payload.handIdx

  if (state.deck.cards.length <= 0) state.deck = shuffleDeck(state.deck)
  const topCard = state.deck.cards.pop() as Card
  state.hands[handIdx].cards.push(topCard)

  const cardsValue = getActualCardsValue(state.hands[handIdx].cards)
  if (cardsValue === 21) state.hands[handIdx].state = 'standing'
  if (cardsValue > 21) state.hands[handIdx].state = 'bust'
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

export const doubleDownAction = (
  old: Blackjack,
  action: { payload: { handIdx: number } },
) => {
  const handIdx = action.payload.handIdx
  const state = _.cloneDeep(old)
  const afterHit = hitAction(state, action)
  afterHit.hands[handIdx].bet = afterHit.hands[handIdx].bet * 2
  if (afterHit.hands[handIdx].state === 'playing')
    afterHit.hands[handIdx].state = 'standing'
  return afterHit
}

export const splitAction = (
  old: Blackjack,
  action: { payload: { handIdx: number } },
) => {
  const handIdx = action.payload.handIdx
  const state = _.cloneDeep(old)

  const newHand = createNewHand(state.hands[handIdx].bet, 'split')
  newHand.cards.push(state.hands[handIdx].cards.pop() as Card)
  const draw = drawCards(state.deck, 2)
  state.deck = draw.deck

  state.hands[handIdx].cards.push(draw.cards.pop() as Card)
  newHand.cards.push(draw.cards.pop() as Card)
  state.hands = [...state.hands, newHand]

  return state
}
