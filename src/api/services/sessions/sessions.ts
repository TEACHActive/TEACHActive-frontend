import { createApi } from "@reduxjs/toolkit/query/react";

import { Session } from "./types";
import { baseQuery } from "../util";
import { Response } from "api/types";

const baseEndpoint = "sessions";

export const sessionsApi = createApi({
  reducerPath: "sessionsApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getSessions: builder.query<Response<Session[]>, void>({
      query: () => `${baseEndpoint}`,
    }),
  }),
});

export const { useGetSessionsQuery } = sessionsApi;
