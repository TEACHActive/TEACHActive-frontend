import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import * as ServiceAPI from "api/services";
import sessionReducer from "../redux/sessionSlice";
import counterReducer from "../features/counter/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    session: sessionReducer,
    [ServiceAPI.userApi.reducerPath]: ServiceAPI.userApi.reducer,
    [ServiceAPI.sessionsApi.reducerPath]: ServiceAPI.sessionsApi.reducer,
    [ServiceAPI.armPoseApi.reducerPath]: ServiceAPI.armPoseApi.reducer,
    [ServiceAPI.attendanceApi.reducerPath]: ServiceAPI.attendanceApi.reducer,
    [ServiceAPI.performanceApi.reducerPath]: ServiceAPI.performanceApi.reducer,
    [ServiceAPI.speechApi.reducerPath]: ServiceAPI.speechApi.reducer,
    [ServiceAPI.movementApi.reducerPath]: ServiceAPI.movementApi.reducer,
    [ServiceAPI.sitStandApi.reducerPath]: ServiceAPI.sitStandApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      ServiceAPI.userApi.middleware,
      ServiceAPI.sessionsApi.middleware,
      ServiceAPI.armPoseApi.middleware,
      ServiceAPI.attendanceApi.middleware,
      ServiceAPI.speechApi.middleware,
      ServiceAPI.movementApi.middleware,
      ServiceAPI.sitStandApi.middleware,
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
