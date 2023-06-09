import React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import App from './App.jsx'
import store from './stores/index.js'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'mobx-react'

const { BASE_PATH, NODE_ENV } = process.env
const root = ReactDOMClient.createRoot(document.querySelector('#root'))
const isDevMode = NODE_ENV === 'development'

root.render(
  <Router basename={BASE_PATH}>
    <Provider {...store}>
      <App />
    </Provider>
  </Router>
)

if (isDevMode && module && module.hot) {
  module.hot.accept()
}
