import { Card, PIPS, VALUES } from '../card'
import _ from 'lodash'

export interface Deck {
  cards: Card[]
  graveyard: Card[]
}

export const createNewDeck = (): Deck => ({
  cards: PIPS.flatMap((pip) => VALUES.map((value) => ({ pip, value }))),
  graveyard: [],
})

export const shuffleDeck = (deck: Deck): Deck => ({
  cards: _.shuffle([...deck.cards, ...deck.graveyard]),
  graveyard: [],
})
