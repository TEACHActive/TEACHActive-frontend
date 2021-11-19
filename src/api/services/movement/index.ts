import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../util";
import { Response } from "api/types";
import { InstructorMovementFrame } from "./types";

const baseEndpoint = "movement";

export const movementApi = createApi({
  reducerPath: "movement",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getInstructorMovementInSession: builder.query<
      Response<InstructorMovementFrame[]>,
      { sessionId: string; numSegments: number }
    >({
      query: (arg: { sessionId: string; numSegments: number }) =>
        `${baseEndpoint}/instructor/${arg.sessionId}?numSegments=${arg.numSegments}`,
      // transformResponse: (response: {
      //   data: Response<InstructorMovementFrame[]>;
      // }) =>
      //   response.data.data
      //     ? response.data.data.map(
      //         (frame) => new InstructorMovementFrame(frame)
      //       )
      //     : [],
    }),
  }),
});

export const { useGetInstructorMovementInSessionQuery } = movementApi;
