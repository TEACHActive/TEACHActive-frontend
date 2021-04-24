import storage from "redux-persist/lib/storage";
import { AnyAction, combineReducers } from "redux";

import session from "./session";
import reflections from "./reflections";
import * as ReducerActionType from "redux/actionTypes";
import { CookieSingleton } from "types/cookies.types";

const appReducer = combineReducers({
  session,
  reflections,
});

const rootReducer = (state: any, action: AnyAction) => {
  if (action.type === ReducerActionType.USER_LOGOUT) {
    // for all keys defined in your persistConfig(s)
    storage.removeItem("persist:root");
    // storage.removeItem('persist:otherKey')
    CookieSingleton.getInstance().clearCookies();
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
