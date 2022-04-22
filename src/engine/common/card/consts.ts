export const FACES = Object.freeze(['jack', 'queen', 'king', 'ace'] as const)

export const NUMBERS = Object.freeze([
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
] as const)

export const VALUES = Object.freeze([...NUMBERS, ...FACES] as const)

export type Value = typeof VALUES[number]

export const PIPS = Object.freeze([
  'clubs',
  'diamonds',
  'hearts',
  'spades',
] as const)
export type Pip = typeof PIPS[number]
