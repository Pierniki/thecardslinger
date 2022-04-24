import { Card, isFaceCard, VALUES } from 'engine/common'
import _ from 'lodash'
import { Hand } from './blackjack'

const getCardBlackjackValue = (card: Card): number =>
  isFaceCard(card) ? 10 : VALUES.indexOf(card.value) + 2

export const getPossibleCardsValue = (cards: Card[]): number[] => {
  const acesCount = cards.filter((card) => card.value === 'ace').length

  const binVariations = acesCount ? generateBinaryVariations(acesCount) : null
  const aceValueVariations = binVariations
    ? _.uniq(
        binVariations.map((binString) =>
          binString
            .split('')
            .reduce((sum, current) => sum + (current === '0' ? 1 : 11), 0),
        ),
      )
    : [0]

  const cardValues = cards
    .filter((card) => card.value !== 'ace')
    .map(getCardBlackjackValue)
    .reduce((sum, val) => sum + val, 0)

  const allHandValueVariations = aceValueVariations.map(
    (aceValues) => aceValues + cardValues,
  )

  if (allHandValueVariations.find((val) => val === 21)) return [21]
  const filtered = allHandValueVariations.filter((val) => val <= 21)
  if (filtered.length === 0) return [allHandValueVariations[0]]
  return filtered
}

export const getActualCardsValue = (cards: Card[]) => {
  return getPossibleCardsValue(cards).reduce((prev, current) => {
    if (!prev) return current
    if (current > 21) return prev
    return current
  }, 0)
}

const generateBinaryVariations = (n: number) =>
  Array.from(Array(Math.pow(2, n)).keys()).map((i) =>
    i.toString(2).padStart(n, '0'),
  )

export const createNewHand = (bet: number, type?: 'main' | 'split'): Hand => ({
  bet,
  state: 'playing',
  cards: [],
  type: type ?? 'main',
})
