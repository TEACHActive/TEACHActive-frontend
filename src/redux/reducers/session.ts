import { SET_SESSION_ID } from "../actionTypes";

interface StateShape {
  id: null | number;
}

const initialState = {
  id: null,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case SET_SESSION_ID: {
      const { id } = action.payload;

      return {
        ...state,
        id: id,
      };
    }
    default:
      return state;
  }
}
