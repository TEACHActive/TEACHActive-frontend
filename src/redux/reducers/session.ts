import { message } from "antd";
import apiHandler from "../../api/handler";
import { BaseSession } from "../../api/types";
import {
  GET_SET_REFLECTIONS,
  SET_SELECTED_SESSION,
  SET_SELECTED_SESSION_BY_ID,
  SET_SESSIONS,
} from "../actionTypes";

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
      console.log({ ...state }, sessions);

      return {
        ...state,
        sessions: sessions,
      };
    }
    case GET_SET_REFLECTIONS: {
      const { userUID, sessionId } = action.payload;
      apiHandler
        .updateSessionReflections(sessionId, userUID)
        .then((result) => {
          if (!result) {
            console.error("Could not get reflections");
            message.error("Could not get reflections");
            return state;
          }
          apiHandler
            .getSessionReflections(sessionId, userUID)
            .then((res) => {
              console.log({
                ...state,
                reflections: res.reflections,
              });
              return {
                ...state,
                reflections: [],
              };
            })
            .catch((e) => {
              console.error(e);
              return state;
            });
        })
        .catch((error) => {
          console.error("Could not get reflections", error);
          message.error("Could not get reflections");
          return state;
        });
    }
    default:
      return state;
  }
}
