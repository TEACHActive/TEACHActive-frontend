import axios from "axios";

const BASE_URL = "http://teachactive.engineering.iastate.edu";
const EDUSENSE_STORAGE_URL = BASE_URL + ":5000";
const TEACHACTIVE_STORAGE_URL = BASE_URL + ":4000";

const getAxiosConfig = (
  method: "post" | "get" | "put",
  endpoint: string,
  to: "edusense" | "teachactive",
  data?: any
) => {
  const URL =
    to === "edusense" ? EDUSENSE_STORAGE_URL : TEACHACTIVE_STORAGE_URL;
  return {
    method: method,
    url: `${URL}${endpoint}`,
    data: data,
    auth: {
      username: "edusense",
      password: "onlyForDevelopmentDoNotUseDefaultPasswordInProduction",
    },
  };
};

export { getAxiosConfig };
