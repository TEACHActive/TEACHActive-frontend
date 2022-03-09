import { createApi, skipToken } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../util";
import { Response } from "api/types";
import { InstructorMovementFrame } from "./types";

const baseEndpoint = "movement";

export const movementApi = createApi({
  reducerPath: "movement",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getInstructorMovementInSession: builder.query<
      InstructorMovementFrame[],
      { sessionId: string; chunkSizeInMinutes: number }
    >({
      query: (arg: { sessionId: string; chunkSizeInMinutes: number }) =>
        `${baseEndpoint}/instructor/${arg.sessionId}?chunkSizeInMinutes=${arg.chunkSizeInMinutes}`,
      transformResponse: (response: Response<InstructorMovementFrame[]>) => {
        return response.data || [];
      },
    }),
    getInstructorFoundPercentageInSession: builder.query<
      number,
      { sessionId: string }
    >({
      query: (arg: { sessionId: string }) =>
        `${baseEndpoint}/instructor/found-percentage/${arg.sessionId}`,
      transformResponse: (response: Response<number>) => {
        return response.data || -1;
      },
    }),
  }),
});

export function _useGetInstructorMovementInSessionQuery(
  arg: { sessionId: string; chunkSizeInMinutes: number },
  skip: typeof skipToken | null
) {
  const result = movementApi.useGetInstructorMovementInSessionQuery(
    skip ?? {
      sessionId: arg.sessionId,
      chunkSizeInMinutes: arg.chunkSizeInMinutes,
    }
  );

  return {
    ...result,
    data:
      result.isSuccess && result.data
        ? result.data.map((data) => new InstructorMovementFrame(data))
        : [],
  };
}

export function _useGetInstructorFoundPercentageInSessionQuery(
  arg: { sessionId: string },
  skip: typeof skipToken | null
) {
  const result = movementApi.useGetInstructorFoundPercentageInSessionQuery(
    skip ?? {
      sessionId: arg.sessionId,
    }
  );

  return {
    ...result,
    data: result.data,
  };
}
