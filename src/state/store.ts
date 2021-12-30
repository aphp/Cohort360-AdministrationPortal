import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'

import me from './me'
import providers from './providers'

const rootReducer = combineReducers({
  me,
  providers
})

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, logger))

store.subscribe(() => {
  // Auto save store inside localStorage
  const _store = store.getState() ?? {}
  const { me, providers } = _store // eslint-disable-line

  localStorage.setItem('user', JSON.stringify(me))
  localStorage.setItem('providers', JSON.stringify(providers))
})
