import { message } from "antd";
import apiHandler from "../../api/handler";
import { GET_SET_REFLECTIONS } from "../actionTypes";

interface StateShape {
  reflections: any[];
}

const initialState: StateShape = {
  reflections: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_SET_REFLECTIONS: {
      const { userUID, sessionId } = action.payload;
      return apiHandler
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
                reflections: res.reflections,
              });
              return {
                reflections: res.reflections,
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
