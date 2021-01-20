import {
  ADD_TODO,
  TOGGLE_TODO,
  SET_FILTER,
  SET_SESSION_ID,
} from "./actionTypes";

let nextTodoId = 0;

export const addTodo = (content: any) => ({
  type: ADD_TODO,
  payload: {
    id: ++nextTodoId,
    content,
  },
});

export const toggleTodo = (id: number) => ({
  type: TOGGLE_TODO,
  payload: { id },
});

export const setFilter = (filter: any) => ({
  type: SET_FILTER,
  payload: { filter },
});

export const setSessionID = (id: number) => ({
  type: SET_SESSION_ID,
  payload: { id },
});
