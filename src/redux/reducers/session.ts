import { BaseSession } from "../../api/types";
import { SET_SELECTED_SESSION, SET_SESSIONS } from "../actionTypes";

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
