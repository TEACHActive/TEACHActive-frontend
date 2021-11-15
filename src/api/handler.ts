import axios from "axios";

import { TokenResponse } from "firebase/types";
import { MethodType, Response } from "./types";
import { getAxiosConfig, logAPIError } from "./util";
import reflectionsAPIHandler from "./reflectionsHandler";
import { IReflectionsAPIHandler } from "./reflectionsHandler";

export interface IAPIHandler {
  reflectionsAPIHandler: IReflectionsAPIHandler;
  loginUser(email: string, password: string): Promise<TokenResponse | null>;
}

export class APIHandler implements IAPIHandler {
  reflectionsAPIHandler: IReflectionsAPIHandler;

  loginUser = async (
    email: string,
    password: string
  ): Promise<TokenResponse | null> => {
    const config = getAxiosConfig(
      MethodType.POST,
      `/auth/login`,
      {},
      {
        username: email,
        password: password,
      }
    );

    try {
      const axiosResponse = await axios.request(config);
      const response = new Response<TokenResponse>(
        axiosResponse.data,
        TokenResponse
      ).data;

      return response;
    } catch (error) {
      logAPIError("Failed to login user", true);
      return null;
    }
  };

  constructor(
    _reflectionsAPIHandler: IReflectionsAPIHandler = reflectionsAPIHandler
  ) {
    this.reflectionsAPIHandler = _reflectionsAPIHandler;
  }
}

const apiHandler: IAPIHandler = new APIHandler();

export default apiHandler;
