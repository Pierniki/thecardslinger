import { Card, Deck, drawCards, shuffleDeck } from 'engine/common'
import _ from 'lodash'
import {
  createNewHand,
  getActualCardsValue,
  getPossibleCardsValue,
} from './utility'

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
  type: 'main' | 'split'
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
  hands: state.hands
    .filter((hand) => hand.type === 'main')
    .map(() => createNewHand(0)),
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

  const draw = drawCards(state.deck, 2)
  state.dealer.cards = draw.cards
  state.deck = draw.deck

  const newHands = state.hands.map((hand) => {
    const draw = drawCards(state.deck, 2)
    state.deck = draw.deck

    const cardsValue = getActualCardsValue(draw.cards)
    return {
      ...hand,
      cards: draw.cards,
      state: cardsValue === 21 ? 'standing' : hand.state,
    }
  })
  state.hands = newHands

  return state
}

export const calculateWinnings = (hand: Hand, dealer: Dealer) => {
  const handValue = getActualCardsValue(hand.cards)
  const dealerValue = getActualCardsValue(dealer.cards)

  const dealerBustWin = dealer.state === 'bust' && hand.state !== 'bust'
  const handWin =
    dealer.state === 'standing' &&
    hand.state === 'standing' &&
    handValue > dealerValue
  const isWin = dealerBustWin || handWin
  const isDraw = hand.state === 'standing' && handValue === dealerValue
  const isBlackjack = handValue === 21

  if (isDraw) return hand.bet
  if (!isWin) return 0
  return hand.bet + hand.bet * (isBlackjack ? 1.5 : 1)
}
