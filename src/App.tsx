import { Blackjack } from 'components/Blackjack'
import { TopBar } from 'components/TopBar'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from 'state'

function App() {
  return (
    <Provider store={store}>
      <div className="App font-pixel">
        <TopBar />
        <Blackjack />
      </div>
    </Provider>
  )
}

export default App
