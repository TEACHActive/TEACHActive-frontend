import { message } from "antd";

import { MethodType } from "./types";
import {
  TEACHACTIVE_BACKEND_URL,
  TEACHACTIVE_BACKEND_PORT,
  TEACHACTIVE_BACKEND_PORT_DEV,
} from "variables/enviromentVariables";
import { logger } from "logging";

const BASE_URL = (port: number) => `${TEACHACTIVE_BACKEND_URL}:${port}`;

const getAxiosConfig = (method: MethodType, endpoint: string, data?: any) => {
  const URL =
    process.env.NODE_ENV === "production"
      ? BASE_URL(TEACHACTIVE_BACKEND_PORT)
      : BASE_URL(TEACHACTIVE_BACKEND_PORT_DEV);

  return {
    method: method,
    url: `${URL}${endpoint}`,
    data: data,
  };
};

/**
 * To avoid needing to create wrapper classes for all calls that return an array.
 * Ex.
 * new ClassArrayFactory<ArmPosesInFrame>().transformToClass(
 *     ArmPosesInFrame
 * )
 *
 * return response.data?.arr
 */
export class ClassArrayFactory<T> {
  transformToClass = (dataType: new (data: any) => T) =>
    class Inner {
      arr: T[] | undefined;

      constructor(data: any) {
        this.arr = data.data.map((item: any) => new dataType(item));
      }
    };
}

export const logAPIError = (error: string, showMessageToUser: boolean) => {
  logger.error(error, () => {
    if (showMessageToUser) message.error(error);
  });
};

export { getAxiosConfig };
