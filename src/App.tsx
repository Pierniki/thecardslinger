import { Blackjack } from 'components/Blackjack'
import { Experimental } from 'components/Experimental/Experimental'
import { TopBar } from 'components/TopBar'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from 'state'

function App() {
  return (
    <Provider store={store}>
      <div className="font-pixel bg-stone-700 h-screen flex flex-col overflow-x-hidden relative">
        <TopBar />
        {/* <Blackjack /> */}
        <Experimental />
      </div>
    </Provider>
  )
}

export default App
