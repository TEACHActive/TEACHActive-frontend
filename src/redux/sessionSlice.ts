import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../app/store";
import { getCameraFPS } from "api/services/util";
import { ISession, Session } from "api/services/sessions/types";

export interface SessionState {
  selectedSession?: ISession;
}

const initialState: SessionState = {
  selectedSession: undefined,
};

// // The function below is called a thunk and allows us to perform async logic. It
// // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// // will call the thunk with the `dispatch` function as the first argument. Async
// // code can then be executed and other actions can be dispatched. Thunks are
// // typically used to make async requests.
// export const incrementAsync = createAsyncThunk(
//   "session/fetchCount",
//   async (amount: number) => {
//     const response = await fetchCount(amount);
//     // The value we return becomes the `fulfilled` action payload
//     return response.data;
//   }
// );

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setSelectedSession: (
      state,
      action: PayloadAction<ISession | undefined>
    ) => {
      if (!action.payload) {
        //Setting selected session to undefined
        state.selectedSession = action.payload;
      } else {
        //Dehydrate the session before putting it in the store
        const { id, name, userUID, performance, createdAtISO } = action.payload;
        state.selectedSession = {
          id: id,
          name: name,
          userUID: userUID,
          createdAtISO: createdAtISO,
          performance: performance,
        };
      }
    },
  },
});

export const { setSelectedSession } = sessionSlice.actions;

// // The function below is called a selector and allows us to select a value from
// // the state. Selectors can also be defined inline where they're used instead of
// // in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export const selectSelectedSession = (state: RootState) =>
  state.session.selectedSession
    ? new Session(state.session.selectedSession, getCameraFPS())
    : undefined; //Hydrate the session

// // We can also write thunks by hand, which may contain both sync and async logic.
// // Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd = (amount: number): AppThunk => (
//   dispatch,
//   getState
// ) => {
//   const currentValue = selectCount(getState());
//   if (currentValue % 2 === 1) {
//     dispatch(incrementByAmount(amount));
//   }
// };

export default sessionSlice.reducer;
