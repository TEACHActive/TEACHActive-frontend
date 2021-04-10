import { BaseSession } from "../../api/types";
import {
  SET_SELECTED_SESSION,
  SET_SELECTED_SESSION_BY_ID,
  SET_SESSIONS,
} from "../actionTypes";

interface StateShape {
  selectedSession: BaseSession | null;
  sessions: BaseSession[];
}

const initialState: StateShape = {
  selectedSession: null,
  sessions: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case SET_SELECTED_SESSION: {
      const { selectedSession } = action.payload;

      return {
        ...state,
        selectedSession: selectedSession,
      };
    }
    case SET_SELECTED_SESSION_BY_ID: {
      const { id } = action.payload;

      const matchingSession = state.sessions.find(
        (session: BaseSession) => session.id === id
      );
      if (!matchingSession) console.error("unable to find matching session");

      return {
        ...state,
        selectedSession: matchingSession ?? state.selectedSession,
      };
    }
    case SET_SESSIONS: {
      const { sessions } = action.payload;

      return {
        sessions: sessions,
      };
    }
    default:
      return state;
  }
}
