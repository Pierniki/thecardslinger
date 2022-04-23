import { createSlice } from '@reduxjs/toolkit'

interface Player {
  money: number
}

const initialState: Player = {
  money: 10,
}

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    addMoney: (state, action: { payload: { amount: number } }) => {
      console.log(`${state.money} ==> ${state.money + action.payload.amount}`)
      state.money = state.money + action.payload.amount
    },
    removeMoney: (state, action: { payload: { amount: number } }) => {
      console.log(`${state.money} ==> ${state.money - action.payload.amount}`)

      state.money = state.money - action.payload.amount
    },
  },
})

export const { addMoney, removeMoney } = playerSlice.actions
export default playerSlice.reducer
