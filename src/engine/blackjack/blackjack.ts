import {
  Card,
  createNewDeck,
  Deck,
  isFaceCard,
  shuffleDeck,
  VALUES,
} from 'engine/common'
import _ from 'lodash'

const deck = shuffleDeck(createNewDeck())

// PLAYER CHOICES:
// - hit
// - double down
// - split

interface Hand {
  bet: number
  cards: Card[]
}

// TODO account for player money
const canSplit = (spot: Hand) =>
  spot.cards.length === 2 && spot.cards[0].value === spot.cards[1].value

const getCardBlackjackValue = (card: Card): number =>
  isFaceCard(card) ? 10 : VALUES.indexOf(card.value) + 2

export const getHandValue = (hand: Hand): number[] => {
  const acesCount = hand.cards.filter((card) => card.value === 'ace').length

  const binVariations = generateBinaryVariations(acesCount)
  const aceValueVariations = _.uniq(
    binVariations.map((binString) =>
      binString
        .split('')
        .reduce((sum, current) => sum + (current === '0' ? 1 : 11), 0),
    ),
  )

  const cardValues = hand.cards
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

interface Blackjack {
  deck: Deck
  hands: Hand[]
}

const generateBinaryVariations = (n: number) =>
  Array.from(Array(Math.pow(2, n)).keys()).map((i) =>
    i.toString(2).padStart(n, '0'),
  )
