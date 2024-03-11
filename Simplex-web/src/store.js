import { configureStore } from '@reduxjs/toolkit';
import configReducer from './reducers/configReducer';

const Store = configureStore({
  reducer: {
    config: configReducer
  }
});

export default Store;