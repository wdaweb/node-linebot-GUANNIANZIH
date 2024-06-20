// tempTest.js
import commandsCF from '../commands/coffee.js'

const mockEvent = {
  message: {
    type: 'text',
    text: '地區'
  },
  reply: (message) => {
    console.log('Replied with:', message)
    return Promise.resolve()
  }
}

commandsCF(mockEvent)
