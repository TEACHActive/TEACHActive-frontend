import { createApi, skipToken } from "@reduxjs/toolkit/query/react";

import { baseQuery, getCameraFPS } from "../util";
import { Response } from "api/types";
import { ArmPoseStats, ArmPoseTotalsStats } from "./types";
import { Session } from "../sessions/types";

const baseEndpoint = "armPose";

export const armPoseApi = createApi({
  reducerPath: "armPose",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getArmPoseDataInSession: builder.query<
      ArmPoseStats[],
      { sessionId: string; chunkSizeInMinutes: number }
    >({
      query: (arg: { sessionId: string; chunkSizeInMinutes: number }) =>
        `${baseEndpoint}/data/${arg.sessionId}?chunkSizeInMinutes=${arg.chunkSizeInMinutes}`,
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
    getArmPoseTotalsInMultipleSessions: builder.query<
      { data: ArmPoseTotalsStats; session: Session }[] | null,
      string[]
    >({
      query: (sessionIds: string[]) =>
        `${baseEndpoint}/multiple/totals/seconds${sessionIds
          .map(
            (sessionId, i) => `${i == 0 ? "?" : "&"}sessionIds[]=${sessionId}`
          )
          .join("")}`,
      transformResponse: (
        response: Response<{ data: ArmPoseTotalsStats; session: Session }[]>
      ) => {
        return response.data;
      },
    }),
  }),
});

export function _useGetArmPoseDataInSessionQuery(
  arg: {
    sessionId: string;
    chunkSizeInMinutes: number;
  },
  skip: typeof skipToken | null
) {
  const result = armPoseApi.useGetArmPoseDataInSessionQuery(
    skip || {
      sessionId: arg.sessionId,
      chunkSizeInMinutes: arg.chunkSizeInMinutes,
    }
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

export function _useGetArmPoseTotalsInMultipleSessionsQuery(
  sessionIds: string[] | typeof skipToken
) {
  const result = armPoseApi.useGetArmPoseTotalsInMultipleSessionsQuery(
    sessionIds
  );

  return {
    ...result,
    data:
      result.isSuccess && result.data
        ? result.data.map((val) => {
            return {
              data: new ArmPoseTotalsStats(val.data),
              session: new Session(val.session, getCameraFPS()),
            };
          })
        : null,
  };
}
