import { createApi, skipToken } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../util";
import { Response } from "api/types";
import { CombinedSpeechFrame, SpeechSessionTotals } from "./types";

const baseEndpoint = "speech";

export const speechApi = createApi({
  reducerPath: "speech",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getSpeechTotalsInSeconds: builder.query<
      SpeechSessionTotals | null,
      { sessionId: string; minSpeakingAmp: number }
    >({
      query: (arg: { sessionId: string; minSpeakingAmp: number }) =>
        `${baseEndpoint}/totals/seconds/${arg.sessionId}?minSpeakingAmp=${arg.minSpeakingAmp}`,
      transformResponse: (response: Response<SpeechSessionTotals>) => {
        return response.data;
      },
    }),
    getCombinedSpeechDataInSession: builder.query<
      CombinedSpeechFrame[],
      { sessionId: string; minSpeakingAmp: number; chunkSizeInMinutes: number }
    >({
      query: (arg: {
        sessionId: string;
        minSpeakingAmp: number;
        chunkSizeInMinutes: number;
      }) =>
        `${baseEndpoint}/data/${arg.sessionId}?minSpeakingAmp=${arg.minSpeakingAmp}&chunkSizeInMinutes=${arg.chunkSizeInMinutes}`,
      transformResponse: (response: Response<CombinedSpeechFrame[]>) => {
        return response.data || [];
      },
    }),
  }),
});

export function _useGetSpeechTotalsInSecondsQuery(
  arg: { sessionId: string; minSpeakingAmp: number },
  skip: typeof skipToken | null
) {
  const result = speechApi.useGetSpeechTotalsInSecondsQuery(
    skip ?? {
      sessionId: arg.sessionId,
      minSpeakingAmp: arg.minSpeakingAmp,
    }
  );

  return {
    ...result,
    data:
      result.isSuccess && result.data
        ? new SpeechSessionTotals(result.data)
        : null,
  };
}

export function _useGetCombinedSpeechDataInSessionQuery(
  arg: {
    sessionId: string;
    minSpeakingAmp: number;
    chunkSizeInMinutes: number;
  },
  skip: typeof skipToken | null
) {
  const result = speechApi.useGetCombinedSpeechDataInSessionQuery(
    skip || {
      sessionId: arg.sessionId,
      minSpeakingAmp: arg.minSpeakingAmp,
      chunkSizeInMinutes: arg.chunkSizeInMinutes,
    }
  );

  return {
    ...result,
    data:
      result.isSuccess && result.data
        ? result.data.map((data) => new CombinedSpeechFrame(data))
        : [],
  };
}
