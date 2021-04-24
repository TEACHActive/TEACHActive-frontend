import { MethodType } from "./types";

const BASE_URL = (https: boolean, port: number) =>
  `http${https ? "s" : ""}://teachactive.engineering.iastate.edu:${port}`;
const TEACHACTIVE_URL = BASE_URL(true, 4000);
const TEACHACTIVE_URL_DEV = BASE_URL(false, 4001);

const getAxiosConfig = (method: MethodType, endpoint: string, data?: any) => {
  const URL =
    process.env.NODE_ENV === "production"
      ? TEACHACTIVE_URL
      : TEACHACTIVE_URL_DEV;

  return {
    method: method,
    url: `${URL}${endpoint}`,
    data: data,
  };
};

export { getAxiosConfig };
