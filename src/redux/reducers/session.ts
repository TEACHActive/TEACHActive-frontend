import * as ReducerActionType from "redux/actionTypes";
import { BaseSession } from "api/types";

interface StateShape {
  selectedSession: BaseSession | null;
  sessions: BaseSession[];
  reflections: any[];
}

const initialState: StateShape = {
  selectedSession: null,
  sessions: [],
  reflections: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case ReducerActionType.SET_SELECTED_SESSION: {
      const { selectedSession } = action.payload;

      return {
        ...state,
        selectedSession: selectedSession,
      };
    }
    case ReducerActionType.SET_SELECTED_SESSION_BY_ID: {
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
    case ReducerActionType.UPDATE_SESSIONS:
      const { sessions } = action.payload;

      return {
        ...state,
        sessions: sessions,
      };
    default:
      return state;
  }
}
