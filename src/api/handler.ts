import axios from "axios";
import { getAxiosConfig } from "./util";

export interface IAPIHandler {
    getSessionIDs(): Promise<any>;
}

export class APIHandler implements IAPIHandler {
    getSessionIDs = async(): Promise<any> => {
        console.log("getSessionIDs");
        
        const data = JSON.stringify({
            query: `{
                sessions {
                    id
                }
            }`,
            variables: {}
        });

        const config = getAxiosConfig("post", "/query", data);
        console.log(config);
        

        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}