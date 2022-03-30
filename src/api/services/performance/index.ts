import { createApi, skipToken } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../util";
import { MethodType, Response } from "api/types";
import { SessionPerformance } from "./types";

const baseEndpoint = "performance";

export const performanceApi = createApi({
  reducerPath: "performance",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getPerformanceForSession: builder.query<SessionPerformance | null, string>({
      query: (sessionId: string) => `${baseEndpoint}/stats/${sessionId}`,
      transformResponse: (response: Response<SessionPerformance>) => {
        return response.data;
      },
    }),
    updatePerformanceForSession: builder.mutation<
      SessionPerformance | null,
      { sessionId: string; performance: number }
    >({
      query(data) {
        const { sessionId, performance } = data;
        return {
          url: `${baseEndpoint}/${sessionId}`,
          method: MethodType.PUT,
          body: {
            performance: performance,
          },
        };
      },
      transformResponse: (response: Response<SessionPerformance>) => {
        return response.data;
      },
      //   invalidatesTags: ["SessionPerformance"] // Maybe I need to fill out providesTags???
      //   (result, error, { sessionId }) => [
      //     { type: "SessionPerformance", id: sessionId },
      //   ],
    }),
  }),
});

export function _useGetPerformanceForSessionQuery(
  sessionId: string | typeof skipToken
) {
  const result = performanceApi.useGetPerformanceForSessionQuery(sessionId);

  return {
    ...result,
    data:
      result.isSuccess && result.data
        ? new SessionPerformance(result.data)
        : null,
  };
}

export function _useUpdatePerformanceForSessionMutation() {
  const [
    updatePerformanceForSession,
    result,
  ] = performanceApi.useUpdatePerformanceForSessionMutation();

  return {
    updatePerformanceForSession: updatePerformanceForSession,
    updateSessionNameResult: {
      ...result,
      data:
        result.isSuccess && result.data
          ? new SessionPerformance(result.data)
          : undefined,
    },
  };
}
