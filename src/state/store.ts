import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'

import me from './me'
import users from './users'
import autoLogout from './autoLogout'

const rootReducer = combineReducers({
  me,
  users,
  autoLogout
})

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, logger))

store.subscribe(() => {
  // Auto save store inside localStorage
  const _store = store.getState() ?? {}
  const { me, users, autoLogout } = _store

  localStorage.setItem('user', JSON.stringify(me))
  localStorage.setItem('users', JSON.stringify(users))
  localStorage.setItem('autoLogout', JSON.stringify(autoLogout))
})
