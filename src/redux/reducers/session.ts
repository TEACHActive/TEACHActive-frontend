import * as ReducerActionType from "redux/actionTypes";
import { BaseSession } from "api/types";

interface StateShape {
  selectedSession: BaseSession | null;
  sessions: BaseSession[];
  keywordFilter: string | undefined;
  reflections: any[];
  metrics: any[];
}

const initialState: StateShape = {
  selectedSession: null,
  sessions: [],
  keywordFilter: undefined,
  reflections: [],
  metrics: []
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
    case ReducerActionType.SET_KEYWORD_FILTER:
      const { keyword } = action.payload;
      return {
        ...state,
        keywordFilter: keyword,
      };
    case ReducerActionType.UPDATE_METRICS:
      const metrics = action.payload;
      return {
        ...state,
        metrics: metrics
      }
    default:
      return state;
  }
}
