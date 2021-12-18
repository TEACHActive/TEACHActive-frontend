import { createApi, skipToken } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../util";
import { Response } from "api/types";
import { ArmPoseStats, ArmPoseTotalsStats } from "./types";

const baseEndpoint = "armPose";

export const armPoseApi = createApi({
  reducerPath: "armPose",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getArmPoseDataInSession: builder.query<
      ArmPoseStats[],
      { sessionId: string; numSegments: number }
    >({
      query: (arg: { sessionId: string; numSegments: number }) =>
        `${baseEndpoint}/data/${arg.sessionId}?numSegments=${arg.numSegments}`,
      transformResponse: (response: Response<ArmPoseStats[]>) => {
        return response.data || [];
      },
    }),
    getArmPoseTotalsInSecondsSession: builder.query<
      ArmPoseTotalsStats | null,
      string
    >({
      query: (sessionId: string) =>
        `${baseEndpoint}/totals/seconds/${sessionId}`,
      transformResponse: (response: Response<ArmPoseTotalsStats>) => {
        return response.data;
      },
    }),
  }),
});

export function _useGetArmPoseDataInSessionQuery(
  arg: {
    sessionId: string;
    numSegments: number;
  },
  skip: typeof skipToken | null
) {
  const result = armPoseApi.useGetArmPoseDataInSessionQuery(
    skip || { sessionId: arg.sessionId, numSegments: arg.numSegments }
  );

  return {
    ...result,
    data:
      result.isSuccess && result.data
        ? result.data.map((data) => new ArmPoseStats(data))
        : [],
  };
}

export function _useGetArmPoseTotalsInSecondsSessionQuery(
  sessionId: string | typeof skipToken
) {
  const result = armPoseApi.useGetArmPoseTotalsInSecondsSessionQuery(sessionId);

  return {
    ...result,
    data:
      result.isSuccess && result.data
        ? new ArmPoseTotalsStats(result.data)
        : null,
  };
}
