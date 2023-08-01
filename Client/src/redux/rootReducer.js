// rootReducer.js

import { combineReducers } from 'redux';
import userReducer from './userSlice';
import alertReducer from './alertSlice';

const rootReducer = combineReducers({
  user: userReducer,
  alert: alertReducer, // Add the alert reducer here
});

export default rootReducer;