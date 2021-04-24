// import * as ReducerActionType from "redux/actionTypes";

interface StateShape {
  reflections: any[];
}

const initialState: StateShape = {
  reflections: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    default:
      return state;
  }
}
