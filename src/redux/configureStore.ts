import { applyMiddleware, compose, createStore } from 'redux';
import redixImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import { StoreState } from './store-state';

// Create or import an events map.
// See "getting started" pages for instructions.

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export default function configureStore(initialState?: StoreState) {
  const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunkMiddleware, redixImmutableStateInvariant()))
  );
}
