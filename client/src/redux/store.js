import { configureStore } from "@reduxjs/toolkit";
import { sidebarReducer, userinfoReducer } from "./slice/slice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  userinfo: userinfoReducer,
});
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userinfo"], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);
