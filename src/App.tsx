import React from "react";

import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";

import userReducer from "reducers/user";
import Routes from "routes";
import { IReduxStore } from "types";

import "./App.css";

const rootReducer = combineReducers<IReduxStore>({
  user: userReducer,
});

const store = createStore(rootReducer);

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Routes />
      </Provider>
    </div>
  );
}

export default App;
