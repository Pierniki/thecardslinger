import { Card, Deck, shuffleDeck } from 'engine/common'
import _ from 'lodash'
import { createNewHand, getPossibleCardsValue } from './utility'

export interface Blackjack {
  state: PossibleBlackjackStates
  deck: Deck
  dealer: Dealer
  hands: Hand[]
}

export interface Dealer {
  cards: Card[]
  state: PossibleDealerStates
}

export interface Hand {
  bet: number
  state: PossibleHandStates
  cards: Card[]
}

export type PossibleBlackjackStates =
  | 'betting'
  | 'dealing'
  | 'playerTurn'
  | 'dealerTurn'
  | 'payout'

export type PossibleHandStates = 'playing' | 'standing' | 'bust'

export type PossibleDealerStates = 'waiting' | 'playing' | 'standing' | 'bust'

export const updateState = (
  blackjack: Blackjack,
  newState: PossibleBlackjackStates,
): Blackjack => ({ ...blackjack, state: newState })

export const playDealer = (old: Blackjack): Blackjack => {
  const state = _.cloneDeep(old)
  state.dealer.state = 'playing'
  const cardsValue = getPossibleCardsValue(state.dealer.cards)

  if (cardsValue.every((value) => value > 21)) {
    state.dealer.state = 'bust'
    return state
  }
  if (cardsValue.some((value) => value >= 17)) {
    state.dealer.state = 'standing'
    return state
  }
  if (state.deck.cards.length <= 0) state.deck = shuffleDeck(state.deck)
  const topCard = state.deck.cards.pop() as Card
  state.dealer.cards.push(topCard)
  state.dealer.state = 'waiting'
  return state
}

export const prepareForBets = (state: Blackjack): Blackjack => ({
  deck: {
    ...state.deck,
    graveyard: [
      ...state.deck.graveyard,
      ...state.hands.flatMap((hand) => hand.cards),
      ...state.dealer.cards,
    ],
  },
  hands: state.hands.map(() => createNewHand(0)),
  dealer: { cards: [], state: 'waiting' },
  state: 'betting',
})

export const deal = (old: Blackjack): Blackjack => {
  const state = _.cloneDeep(old)

  state.deck.graveyard = [
    ...state.deck.graveyard,
    ...state.hands.flatMap((hand) => hand.cards),
    ...state.dealer.cards,
  ]

  if (state.deck.cards.length <= 0) state.deck = shuffleDeck(state.deck)
  state.dealer.cards = [state.deck.cards.pop() as Card]
  if (state.deck.cards.length <= 0) state.deck = shuffleDeck(state.deck)
  state.dealer.cards = [...state.dealer.cards, state.deck.cards.pop() as Card]

  const newHands = state.hands.map((hand) => {
    if (state.deck.cards.length <= 0) state.deck = shuffleDeck(state.deck)
    const topCard = state.deck.cards.pop() as Card
    return { ...hand, cards: [topCard] }
  })
  state.hands = newHands

  return state
}
