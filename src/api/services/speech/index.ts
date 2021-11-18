import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../util";
import { Response } from "api/types";
import { SpeechSessionTotals } from "./types";

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
  }),
});

export const { useGetSpeechTotalsInSecondsQuery } = speechApi;
