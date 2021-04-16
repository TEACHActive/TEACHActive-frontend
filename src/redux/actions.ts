import firebase from "firebase";
import { BaseSession } from "../api/types";
import * as ReducerActionType from "./actionTypes";

export const setSelectedSession = (selectedSession: BaseSession | null) => ({
  type: ReducerActionType.SET_SELECTED_SESSION,
  payload: { selectedSession },
});

export const setSelectedSessionById = (id: string) => ({
  type: ReducerActionType.SET_SELECTED_SESSION_BY_ID,
  payload: { id },
});

export const setSessions = (sessions: BaseSession[]) => ({
  type: ReducerActionType.SET_SESSIONS,
  payload: { sessions },
});

export const setUserUID = (userUID: string) => ({
  type: ReducerActionType.SET_USER_UID,
  payload: { userUID },
});

export const getSetReflections = (userUID: string, sessionId: string) => ({
  type: ReducerActionType.GET_SET_REFLECTIONS,
  payload: { userUID, sessionId },
});
