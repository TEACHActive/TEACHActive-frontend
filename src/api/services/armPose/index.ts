import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../util";
import { Response } from "api/types";
import { ArmPoseStats, ArmPoseTotalsStats } from "./types";

const baseEndpoint = "armPose";

export const armPoseApi = createApi({
  reducerPath: "armPose",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getArmPoseDataInSession: builder.query<
      Response<ArmPoseStats[]>,
      { sessionId: string; numSegments: number }
    >({
      query: (arg: { sessionId: string; numSegments: number }) =>
        `${baseEndpoint}/data/${arg.sessionId}?numSegments=${arg.numSegments}`,
    }),
    getArmPoseTotalsInSecondsSession: builder.query<
      Response<ArmPoseTotalsStats>,
      string
    >({
      query: (sessionId: string) => `${baseEndpoint}/data/${sessionId}`,
    }),
  }),
});

export const {
  useGetArmPoseDataInSessionQuery,
  useGetArmPoseTotalsInSecondsSessionQuery,
} = armPoseApi;
