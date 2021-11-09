import { IReflectionsAPIHandler } from "./reflectionsHandler";
import reflectionsAPIHandler from "./reflectionsHandler";
import { InstructorNameResponse, MethodType, Response } from "./types";
import { getAxiosConfig, logAPIError } from "./util";
import axios from "axios";

export interface IAPIHandler {
  reflectionsAPIHandler: IReflectionsAPIHandler;
  getInstructorName(userUID: string): Promise<InstructorNameResponse | null>;
}

export class APIHandler implements IAPIHandler {
  reflectionsAPIHandler: IReflectionsAPIHandler;

  constructor(
    _reflectionsAPIHandler: IReflectionsAPIHandler = reflectionsAPIHandler
  ) {
    this.reflectionsAPIHandler = _reflectionsAPIHandler;
  }

  getInstructorName = async (
    userUID: string
  ): Promise<InstructorNameResponse | null> => {
    const config = getAxiosConfig(
      MethodType.GET,
      `/teachactive/name/${userUID}`
    );

    try {
      const axiosResponse = await axios.request(config);
      const response = new Response<InstructorNameResponse>(
        axiosResponse.data,
        InstructorNameResponse
      ).data;

      return response;
    } catch (error) {
      logAPIError("Failed to get Instructor Name", true);
      return null;
    }
  };
}

const apiHandler: IAPIHandler = new APIHandler();

export default apiHandler;
