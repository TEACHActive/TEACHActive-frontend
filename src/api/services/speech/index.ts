import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../util";
import { Response } from "api/types";
import { CombinedSpeechFrame, SpeechSessionTotals } from "./types";

const baseEndpoint = "speech";

export const speechApi = createApi({
  reducerPath: "speech",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getSpeechTotalsInSeconds: builder.query<
      Response<SpeechSessionTotals>,
      { sessionId: string; minSpeakingAmp: number }
    >({
      query: (arg: { sessionId: string; minSpeakingAmp: number }) =>
        `${baseEndpoint}/totals/seconds/${arg.sessionId}?minSpeakingAmp=${arg.minSpeakingAmp}`,
    }),
    getCombinedSpeechDataInSession: builder.query<
      Response<CombinedSpeechFrame[]>,
      { sessionId: string; minSpeakingAmp: number; numSegments: number }
    >({
      query: (arg: {
        sessionId: string;
        minSpeakingAmp: number;
        numSegments: number;
      }) =>
        `${baseEndpoint}/data/${arg.sessionId}?minSpeakingAmp=${arg.minSpeakingAmp}?numSegments=${arg.numSegments}`,
    }),
  }),
});

export const {
  useGetSpeechTotalsInSecondsQuery,
  useGetCombinedSpeechDataInSessionQuery,
} = speechApi;
