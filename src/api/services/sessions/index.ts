import { createApi, skipToken } from "@reduxjs/toolkit/query/react";

import { baseQuery, getCameraFPS } from "../util";
import { Response } from "api/types";
import { ISession, Session } from "./types";

const baseEndpoint = "sessions";

export const sessionsApi = createApi({
  reducerPath: "sessionsApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getSessions: builder.query<ISession[], boolean>({
      query: () => `${baseEndpoint}`,
      transformResponse: (response: Response<ISession[]>) => {
        return response.data || [];
      },
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

/**
 * This hook wraps the RTK Query hook giving it rehydration of objects
 * with non-serealizeable data without keeping it in the store (as transformResult does)
 * @param value If query should use skipToken
 * @returns SessionQueryResult, with Sessions constructed
 */
export function _useGetSessionsQuery(value: boolean) {
  const result = sessionsApi.useGetSessionsQuery(value ?? skipToken);

  return {
    ...result,
    data:
      result.isSuccess && result.data
        ? result.data.map((data) => new Session(data, getCameraFPS()))
        : [],
  };
}

export function _useUpdateSessionNameMutation() {
  const [
    updateSessionName,
    updateSessionNameResult,
  ] = sessionsApi.useUpdateSessionNameMutation();

  return {
    updateSessionName: updateSessionName,
    updateSessionNameResult: {
      ...updateSessionNameResult,
      data:
        updateSessionNameResult.isSuccess && updateSessionNameResult.data
          ? new Session(updateSessionNameResult.data, getCameraFPS())
          : undefined,
    },
  };
}
