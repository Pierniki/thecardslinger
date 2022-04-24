import { Card, PIPS, VALUES } from '../card'
import _ from 'lodash'
import { generateDeviationTransform } from 'utility'

export interface Deck {
  cards: Card[]
  graveyard: Card[]
}

export const createNewDeck = (): Deck => ({
  cards: PIPS.flatMap((pip) =>
    VALUES.map((value) => ({
      pip,
      value,
      transform: generateDeviationTransform(),
    })),
  ),
  graveyard: [],
})

export const shuffleDeck = (deck: Deck): Deck => ({
  cards: _.shuffle([...deck.cards, ...deck.graveyard]),
  graveyard: [],
})

export const drawCards = (deck: Deck, amount: number) => {
  const cards: Card[] = []
  var newDeck = _.cloneDeep(deck)
  Array.from(Array(amount)).forEach(() => {
    if (newDeck.cards.length <= 0) newDeck = shuffleDeck(newDeck)
    cards.push(newDeck.cards.pop() as Card)
  })
  return { cards: cards, deck: newDeck }
}
