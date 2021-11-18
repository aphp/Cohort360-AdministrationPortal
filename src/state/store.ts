import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'

import me from './me'
import portailTopBar from './portailTopBar'

const rootReducer = combineReducers({
  me,
  portailTopBar,
})

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, logger))

store.subscribe(() => {
  // Auto save store inside localStorage
  const _store = store.getState() ?? {}
  const { me } = _store

  localStorage.setItem('user', JSON.stringify(me))
})
