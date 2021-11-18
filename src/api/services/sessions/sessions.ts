import { createApi } from "@reduxjs/toolkit/query/react";

import { Session } from "./types";
import { baseQuery } from "../util";
import { Response } from "api/types";

const baseEndpoint = "sessions";

export const sessionsApi = createApi({
  reducerPath: "sessionsApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getSessions: builder.query<Response<Session[]>, boolean>({
      query: () => `${baseEndpoint}`,
    }),
    updateSessionName: builder.mutation<
      Session,
      { sessionId: string; name: string }
    >({
      query(data) {
        const { sessionId, name } = data;
        return {
          url: `${baseEndpoint}/${sessionId}`,
          method: "PUT",
          body: {
            name: name,
          },
        };
      },
    }),
  }),
});

export const {
  useGetSessionsQuery,
  useUpdateSessionNameMutation,
} = sessionsApi;
