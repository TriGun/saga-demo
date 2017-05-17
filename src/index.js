'use strict';

// CONSTANTS
const HOST = 'http://front-dev.pdffiller.com/dev3';
const PAUSE_DELAY = 2000;
const ROOT_ELEMENT_TYPE = 'div';

const API_CONSTANT_TYPES = {
  ACCOUNT: 'ACCOUNT',
  REPORT_PROBLEM: 'REPORT_PROBLEM',
  IMAGE_SIGNATURE: 'IMAGE_SIGNATURE'
};

export const ACTIONS_TYPES = {
  USER_FETCH_REQUESTED: 'USER_FETCH_REQUESTED',
  USER_FETCH_SUCCEEDED: 'USER_FETCH_SUCCEEDED',
  USER_FETCH_FAILED: 'USER_FETCH_FAILED',
  USER_FETCH_MAX_CALLS: 'USER_FETCH_MAX_CALLS'
};

const INITIAL_STATE = {
  constants: null
};



// API
export const Api = {

  fetchJson: (url) => {
    return fetch(url).then( (response) => response.json()).then((body) => body);
  },

  fetchUser: () => {
    return Api.fetchJson(`${HOST}/consts.json?type=${API_CONSTANT_TYPES.ACCOUNT}`);
  },

  fetchConstants: () => {
    return Api.fetchJson(`${HOST}/consts.json?type=${API_CONSTANT_TYPES.REPORT_PROBLEM}`);
  },

  fetchHelpStructure: () => {
    return Api.fetchJson(`${HOST}/consts.json?type=${API_CONSTANT_TYPES.IMAGE_SIGNATURE}`);
  }

};



// SAGA
import { delay } from 'redux-saga';
import { call, put, take, takeEvery} from 'redux-saga/effects';

function* fetchUser() {

  try {

    yield call(delay, PAUSE_DELAY);

    const user = yield call(Api.fetchUser);
    const constants = yield call(Api.fetchConstants);
    const structure = yield call(Api.fetchHelpStructure);

    yield put({type: ACTIONS_TYPES.USER_FETCH_SUCCEEDED, user, constants, structure});

  } catch (e) {

    yield put({type: ACTIONS_TYPES.USER_FETCH_FAILED, message: e.message});

  }
}

export default function* mySaga() {
  yield takeEvery(ACTIONS_TYPES.USER_FETCH_REQUESTED, fetchUser);
}

function* monitorUser() {
  for (let i = 0; i < 3; i++) {
    yield take(ACTIONS_TYPES.USER_FETCH_REQUESTED);
  }
  yield put({type: ACTIONS_TYPES.USER_FETCH_MAX_CALLS})
}



// MIDDLEWARE
function middleware(store, action) {

  return (next) => (action) => {

    return next(action);

  }
}



// REDUCER
function reducer(state = INITIAL_STATE, action){

  switch (action.type){

    case ACTIONS_TYPES.USER_FETCH_SUCCEEDED:
      return {
        ...state,
        constants: {
          ...action.user,
          ...action.constants,
          ...action.structure
        }
      };

    default:
      return state;

  }

}



// COMPONENT
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';

@connect(
  state => ({
    constants: state.reducer.constants
  })
)
class UserComponent extends React.Component {

  onSomeButtonClicked() {

    const { userId, dispatch } = this.props;
    dispatch({type: 'USER_FETCH_REQUESTED', payload: {userId}})

  }

  render(){

    const {constants} = this.props;

    return (
      <div>
        <button onClick={::this.onSomeButtonClicked}>Get all data</button>
        {constants && Object.keys(constants).map((item) => <p>{constants[item]}</p>)}
      </div>
    )
  }

}



// INIT BUILD
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

function configureStore(reducers , middlewares) {

  const finalCreateStore = compose(
    applyMiddleware(...middlewares),
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
  )(createStore);

  return finalCreateStore(combineReducers(reducers), {});

}

import createSagaMiddleware from 'redux-saga';
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({reducer}, [middleware, sagaMiddleware]);
sagaMiddleware.run(mySaga);
sagaMiddleware.run(monitorUser);

const root = document.createElement(ROOT_ELEMENT_TYPE);
document.body.appendChild(root);

ReactDOM.render(
  <Provider store={store}>
      <UserComponent/>
  </Provider>,
  root
);

