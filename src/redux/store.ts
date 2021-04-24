import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { DateTime } from "luxon";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  createTransform,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import rootReducer from "./reducers";

const replacer = (key: any, value: { toISO: () => any }) =>
  value instanceof DateTime ? value.toISO() : value;

const reviver = (key: any, value: string | number | Date) =>
  typeof value === "string" &&
  value.match(
    /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
  )
    ? DateTime.fromISO(value)
    : value;

export const encode = (toDeshydrate: any) =>
  JSON.stringify(toDeshydrate, replacer);

export const decode = (toRehydrate: string) => JSON.parse(toRehydrate, reviver);

const persistConfig = {
  key: "root",
  storage,
  transforms: [createTransform(encode, decode)],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(thunk),
  devTools: process.env.NODE_ENV !== "production",
});
const persistor = persistStore(store);

export default () => {
  return {
    providerStore: store,
    persistor: persistor,
  };
};

//From: https://redux.js.org/recipes/usage-with-typescript
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
