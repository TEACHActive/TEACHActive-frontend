import { combineReducers } from "redux";
import visibilityFilter from "./visibilityFilter";
import todos from "./todos";
import session from "./session";

export default combineReducers({ todos, visibilityFilter, session });
