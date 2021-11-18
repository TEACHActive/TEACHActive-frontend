import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../util";
import { Response } from "api/types";
import { SessionPerformance } from "./types";

const baseEndpoint = "performance";

export const performanceApi = createApi({
  reducerPath: "performance",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getPerformanceForSession: builder.query<
      Response<SessionPerformance>,
      string
    >({
      query: (sessionId: string) => `${baseEndpoint}/${sessionId}`,
    }),
    updatePerformanceForSession: builder.mutation<
      SessionPerformance,
      { sessionId: string; performance: number }
    >({
      query(data) {
        const { sessionId, performance } = data;
        return {
          url: `${baseEndpoint}/${sessionId}`,
          method: "PUT",
          body: {
            performance: performance,
          },
        };
      },
      //   invalidatesTags: ["SessionPerformance"] // Maybe I need to fill out providesTags???
      //   (result, error, { sessionId }) => [
      //     { type: "SessionPerformance", id: sessionId },
      //   ],
    }),
  }),
});

export const {
  useUpdatePerformanceForSessionMutation,
  useGetPerformanceForSessionQuery,
} = performanceApi;
