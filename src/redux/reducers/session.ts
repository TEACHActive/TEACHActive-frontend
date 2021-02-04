import { Session } from "../../pages/metric/metricPage.types";
import { SET_SELECTED_SESSION } from "../actionTypes";

interface StateShape {
  selectedSession: null | Session;
}

const initialState = {
  selectedSession: null,
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
    default:
      return state;
  }
}
