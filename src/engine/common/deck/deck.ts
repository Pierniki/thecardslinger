import { Card, PIPS, VALUES } from '../card'
import _ from 'lodash'

export interface Deck {
  cards: Card[]
}

export const createNewDeck = (): Deck => ({
  cards: PIPS.flatMap((pip) => VALUES.map((value) => ({ pip, value }))),
})

export const shuffleDeck = (deck: Deck): Deck => ({
  cards: _.shuffle(deck.cards),
})
