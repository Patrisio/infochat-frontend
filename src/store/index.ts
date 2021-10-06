import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { rootReducer } from './reducers';
import rootSaga from '../sagas'
import { isProduction } from '../lib/utils/constants';

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  let store;

  isProduction ?
  store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware),
  ) :
  store = createStore(
    rootReducer,
    applyMiddleware(logger, sagaMiddleware),
  );

  sagaMiddleware.run(rootSaga);

  return store;
};

export const store = configureStore();