import { AnyAction, combineReducers } from "redux";
import session from "./session";
import user from "./user";
import * as ReducerActionType from "../../redux/actionTypes";
import storage from "redux-persist/lib/storage";

const appReducer = combineReducers({
  session,
  user,
});

const rootReducer = (state: any, action: AnyAction) => {
  if (action.type === ReducerActionType.USER_LOGOUT) {
    // for all keys defined in your persistConfig(s)
    storage.removeItem("persist:root");
    // storage.removeItem('persist:otherKey')

    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
