import { configureStore } from '@reduxjs/toolkit';
import configReducer from './reducers/configReducer';
import simplexReducer from './reducers/simplexReducer';

const Store = configureStore({
  reducer: {
    config: configReducer,
    simplex: simplexReducer
  }
});

export default Store;