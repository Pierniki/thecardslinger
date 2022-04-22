import { FACES, Pip, Value } from './consts'

export interface Card {
  pip: Pip
  value: Value
}

export const isFaceCard = (card: Card) => FACES.includes(card.value as any)
