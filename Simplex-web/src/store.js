import { configureStore } from '@reduxjs/toolkit';
import configReducer from './reducers/configReducer';
import simplexReducer from './reducers/simplexReducer';
import tableReducer from './reducers/tableReducer';
import notificationReducer from './reducers/notificationReducer';

const Store = configureStore({
  reducer: {
    config: configReducer,
    simplex: simplexReducer,
    table: tableReducer,
    notification: notificationReducer
  }
});

export default Store;