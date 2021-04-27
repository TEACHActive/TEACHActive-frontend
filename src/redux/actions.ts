import apiHandler from "api/handler";
import { BaseSession } from "../api/types";
import * as ReducerActionType from "./actionTypes";
import { AppDispatch } from "./store";

export const setSelectedSession = (selectedSession: BaseSession | null) => ({
  type: ReducerActionType.SET_SELECTED_SESSION,
  payload: { selectedSession },
});

export const setSelectedSessionById = (id: string) => ({
  type: ReducerActionType.SET_SELECTED_SESSION_BY_ID,
  payload: { id },
});

export const updateSessions = (userUID: string) => async (
  dispatch: AppDispatch
) => {
  const sessions = await apiHandler.getSessions(userUID);

  dispatch({
    type: ReducerActionType.UPDATE_SESSIONS,
    payload: {
      sessions: sessions,
    },
  });
};

export const setKeywordFilter = (keyword: string) => ({
  type: ReducerActionType.SET_KEYWORD_FILTER,
  payload: { keyword },
});
export const clearKeywordFilter = () => ({
  type: ReducerActionType.SET_KEYWORD_FILTER,
  payload: { undefined },
});
