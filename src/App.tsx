import { getHandValue } from 'engine/blackjack'
import React from 'react'

function App() {
  return (
    <div className="App">
      <p className="w-full text-center font-pixel text-8xl">Home</p>
      <p>
        {getHandValue({
          bet: 0,
          cards: [{ pip: 'clubs', value: 'ace' }],
        }).toString()}
      </p>
      <p>
        {getHandValue({
          bet: 0,
          cards: [{ pip: 'clubs', value: 'three' }],
        }).toString()}
      </p>
      <p>
        {getHandValue({
          bet: 0,
          cards: [
            { pip: 'clubs', value: 'two' },
            { pip: 'clubs', value: 'ace' },
          ],
        }).toString()}
      </p>
      <p>
        {getHandValue({
          bet: 0,
          cards: [
            { pip: 'clubs', value: 'two' },
            { pip: 'clubs', value: 'three' },
            { pip: 'clubs', value: 'three' },
            { pip: 'clubs', value: 'four' },
            { pip: 'clubs', value: 'four' },
            { pip: 'clubs', value: 'four' },

            { pip: 'clubs', value: 'ace' },
            { pip: 'clubs', value: 'ace' },
            { pip: 'clubs', value: 'ace' },
          ],
        }).toString()}
      </p>
    </div>
  )
}

export default App
