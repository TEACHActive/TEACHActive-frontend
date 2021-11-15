import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import * as ServiceAPI from "api/services";
import counterReducer from "../features/counter/counterSlice";
import sessionReducer from "../redux/sessionSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    session: sessionReducer,
    [ServiceAPI.userApi.reducerPath]: ServiceAPI.userApi.reducer,
    [ServiceAPI.pokemonApi.reducerPath]: ServiceAPI.pokemonApi.reducer,
    [ServiceAPI.sessionsApi.reducerPath]: ServiceAPI.sessionsApi.reducer,
    [ServiceAPI.armPoseApi.reducerPath]: ServiceAPI.armPoseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ServiceAPI.userApi.middleware,
      ServiceAPI.pokemonApi.middleware,
      ServiceAPI.sessionsApi.middleware,
      ServiceAPI.armPoseApi.middleware,
    ]),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
