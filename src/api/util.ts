import axios from "axios";

const BASE_URL_HTTPS = "https://teachactive.engineering.iastate.edu";
const EDUSENSE_STORAGE_URL = BASE_URL_HTTPS + ":5001";

const BASE_URL_HTTP = "http://teachactive.engineering.iastate.edu";
const TEACHACTIVE_STORAGE_URL = BASE_URL_HTTP + ":4000";
const TEACHACTIVE_STORAGE_URL_DEV = BASE_URL_HTTP + ":4001";

const getAxiosConfig = (
  method: "post" | "get" | "put",
  endpoint: string,
  to: "edusense" | "teachactive",
  data?: any
) => {
  const URL =
    to === "edusense"
      ? EDUSENSE_STORAGE_URL
      : process.env.NODE_ENV === "production"
      ? TEACHACTIVE_STORAGE_URL
      : TEACHACTIVE_STORAGE_URL_DEV;

  return {
    method: method,
    url: `${URL}${endpoint}`,
    data: data,
    auth: {
      username: "edusense",
      password: "password",
    },
  };
};

export { getAxiosConfig };
