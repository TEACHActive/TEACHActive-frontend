import firebase from "firebase";
import { BaseSession } from "../api/types";
import * as ReducerActionType from "./actionTypes";

export const setSelectedSession = (selectedSession: BaseSession | null) => ({
  type: ReducerActionType.SET_SELECTED_SESSION,
  payload: { selectedSession },
});

export const setSessions = (sessions: BaseSession[]) => ({
  type: ReducerActionType.SET_SESSIONS,
  payload: { sessions },
});

export const setUserUID = (userUID: string) => ({
  type: ReducerActionType.SET_USER_UID,
  payload: { userUID },
});
