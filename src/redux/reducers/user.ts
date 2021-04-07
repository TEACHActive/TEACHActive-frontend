import firebase from "firebase";
import { SET_USER_UID } from "../actionTypes";

interface StateShape {
  currentUserUID: string;
}

const initialState: StateShape = {
  currentUserUID: "",
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case SET_USER_UID: {
      const { uid } = action.payload;

      return {
        currentUserUID: uid,
      };
    }
    default:
      return state;
  }
}
