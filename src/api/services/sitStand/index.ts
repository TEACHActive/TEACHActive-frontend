import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../util";
import { Response } from "api/types";
import { SitStandInFrame } from "./types";

const baseEndpoint = "sitStand";

export const sitStandApi = createApi({
  reducerPath: "sitStand",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getSitStandDataInSession: builder.query<
      Response<SitStandInFrame[]>,
      { sessionId: string; numSegments: number }
    >({
      query: (arg: { sessionId: string; numSegments: number }) =>
        `${baseEndpoint}/data/${arg.sessionId}?numSegments=${arg.numSegments}`,
    }),
  }),
});

export const { useGetSitStandDataInSessionQuery } = sitStandApi;
