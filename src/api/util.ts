import axios from "axios";

const BASE_URL = "http://teachactive.engineering.iastate.edu:5000";

const getAxiosConfig = (method: "post" | "get", endpoint: string, data: any) => {
    return (
        {
            method: method,
            url: `${BASE_URL}${endpoint}`,
            data : data,
            auth: {
                username: "edusense",
                password: "onlyForDevelopmentDoNotUseDefaultPasswordInProduction"
              }
        }
    )
  };

export {getAxiosConfig}