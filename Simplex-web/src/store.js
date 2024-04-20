import { configureStore } from '@reduxjs/toolkit';
import configReducer from './reducers/configReducer';
import simplexReducer from './reducers/simplexReducer';
import tableReducer from './reducers/tableReducer';

const Store = configureStore({
  reducer: {
    config: configReducer,
    simplex: simplexReducer,
    table: tableReducer
  }
});

export default Store;