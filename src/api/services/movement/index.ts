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
      { sessionId: string; numSegments: number }
    >({
      query: (arg: { sessionId: string; numSegments: number }) =>
        `${baseEndpoint}/instructor/${arg.sessionId}?numSegments=${arg.numSegments}`,
      transformResponse: (response: Response<InstructorMovementFrame[]>) => {
        return response.data || [];
      },
    }),
  }),
});

export function _useGetInstructorMovementInSessionQuery(
  arg: { sessionId: string; numSegments: number },
  skip: typeof skipToken | null
) {
  const result = movementApi.useGetInstructorMovementInSessionQuery(
    skip ?? {
      sessionId: arg.sessionId,
      numSegments: arg.numSegments,
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
