import axios from "axios";
import { BASE_SERVER_URL, TEACHACTIVE_PORT } from "../../constants/api";
import { APIResponse } from "../../types/types";
import { HandRaiseGoalsAndReflections } from "./goalsPage.types";

export interface IGoalsPageAPIHandler {
  getHandRaiseGoals(
    sessionID: string,
    oktaID: string //Could also be userID?
  ): Promise<APIResponse<HandRaiseGoalsAndReflections>>;
  sumbitHandRaiseGoals(
    sessionID: string,
    oktaID: string,
    goals: any
  ): Promise<APIResponse<HandRaiseGoalsAndReflections>>;
}

const BASE_ENDPOINT = "/goals";

export class GoalsPageAPIHandler implements IGoalsPageAPIHandler {
  async getHandRaiseGoals(
    sessionID: string,
    oktaID: string
  ): Promise<APIResponse<HandRaiseGoalsAndReflections>> {
    // const response = await axios.get<any>();

    // return Promise.resolve(
    //   new APIResponse<any>({
    //     statusCode: response.status,
    //     data: response.data,
    //   })
    // );

    return Promise.resolve(
      new APIResponse<HandRaiseGoalsAndReflections>({
        statusCode: 200,
        data: undefined,
      })
    );
  }

  async sumbitHandRaiseGoals(
    sessionID: string,
    oktaID: string,
    goals: any
  ): Promise<APIResponse<HandRaiseGoalsAndReflections>> {
    const response = await axios.post<any>(
      encodeURIComponent(
        `${BASE_SERVER_URL}:${TEACHACTIVE_PORT}/${BASE_ENDPOINT}/hand_raise`
      ),
      {
        params: {
          sessionID: sessionID,
          oktaID: oktaID,
        },
        body: goals,
      }
    );

    return Promise.resolve(
      new APIResponse<any>({
        statusCode: response.status,
        data: response.data,
      })
    );
  }
}
