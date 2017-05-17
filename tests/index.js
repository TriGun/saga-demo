'use strict';

import { call, put } from 'redux-saga/effects'
import { API, ACTIONS_TYPES } from '../src/index';


console.log('API', API);

const iterator = fetchUser();

assert.deepEqual(
  iterator.next().value,
  call(Api.fetchUser),
  "fetchUser should yield an Effect call(Api.fetch,)"
);

const constants = {};

assert.deepEqual(
  iterator.next(constants).value,
  put({ type: ACTIONS_TYPES.USER_FETCH_SUCCEEDED, constants }),
  "fetchUser should yield an Effect put({ type: 'USER_FETCH_SUCCEEDED', constants })"
);