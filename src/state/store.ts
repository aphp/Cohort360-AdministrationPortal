import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'

import me from './me'
import providers from './providers'
import autoLogout from './autoLogout'

const rootReducer = combineReducers({
  me,
  providers,
  autoLogout
})

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, logger))

store.subscribe(() => {
  // Auto save store inside localStorage
  const _store = store.getState() ?? {}
  const { me, providers, autoLogout } = _store // eslint-disable-line

  localStorage.setItem('user', JSON.stringify(me))
  localStorage.setItem('providers', JSON.stringify(providers))
  localStorage.setItem('autoLogout', JSON.stringify(autoLogout))
})
