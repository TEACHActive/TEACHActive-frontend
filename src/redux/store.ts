import { DateTime } from "luxon";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { devToolsEnhancer } from "redux-devtools-extension";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";

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

export default () => {
  let store = createStore(persistedReducer, devToolsEnhancer({}));
  let persistor = persistStore(store);
  return {
    providerStore: store,
    persistor: persistor,
  };
};
