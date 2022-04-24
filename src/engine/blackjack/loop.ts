import { wait } from 'utility'
import {
  Blackjack,
  calculateWinnings,
  deal,
  Dealer,
  Hand,
  playDealer,
  prepareForBets,
  updateState,
} from './blackjack'
import { getActualCardsValue } from './utility'

export const blackjackLoop = async (
  blackjack: Blackjack,
  addMoney: (idx: number, val: number) => void,
): Promise<Blackjack> => {
  const dealingTrigger =
    blackjack.state === 'betting' && everyoneBet(blackjack.hands)
  const playerTurnTrigger =
    blackjack.state === 'dealing' &&
    everyoneBeenDealt(blackjack.hands, blackjack.dealer)
  const dealerTurnTrigger =
    blackjack.state === 'playerTurn' && everyonePlayed(blackjack.hands)
  const payoutTrigger =
    blackjack.state === 'dealerTurn' && dealerPlayed(blackjack.dealer)

  if (dealingTrigger) return updateState(blackjack, 'dealing')
  if (playerTurnTrigger) return updateState(blackjack, 'playerTurn')
  if (dealerTurnTrigger) return updateState(blackjack, 'dealerTurn')
  if (payoutTrigger) return updateState(blackjack, 'payout')

  if (blackjack.state === 'dealing')
    return wait(500).then(() => deal(blackjack))
  if (blackjack.state === 'dealerTurn')
    return wait(1500).then(() => playDealer(blackjack))
  if (blackjack.state === 'payout') {
    blackjack.hands.forEach((hand, idx) =>
      addMoney(idx, calculateWinnings(hand, blackjack.dealer)),
    )
    return wait(1500).then(() => prepareForBets(blackjack))
  }

  return blackjack
}

const everyoneBet = (hands: Hand[]) => hands.every((hand) => hand.bet > 0)
const everyoneBeenDealt = (hands: Hand[], dealer: Dealer) =>
  hands.every((hand) => hand.cards.length === 2 && dealer.cards.length === 2)
const everyonePlayed = (hands: Hand[]) =>
  hands.every(
    (hand) =>
      hand.state !== 'playing' || getActualCardsValue(hand.cards) === 21,
  )
const dealerPlayed = (dealer: Dealer) =>
  dealer.state === 'bust' || dealer.state === 'standing'
