import React from "react";
import { APIHandler } from "../api/apiHandler";

const APIContext = React.createContext(new APIHandler());
export default APIContext;
