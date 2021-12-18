import { createApi, skipToken } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../util";
import { Response } from "api/types";
import { SitStandInFrame } from "./types";

const baseEndpoint = "sitStand";

export const sitStandApi = createApi({
  reducerPath: "sitStand",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getSitStandDataInSession: builder.query<
      SitStandInFrame[],
      { sessionId: string; numSegments: number }
    >({
      query: (arg: { sessionId: string; numSegments: number }) =>
        `${baseEndpoint}/data/${arg.sessionId}?numSegments=${arg.numSegments}`,
      transformResponse: (response: Response<SitStandInFrame[]>) => {
        return response.data || [];
      },
    }),
  }),
});

export function _useGetSitStandDataInSessionQuery(
  arg: { sessionId: string; numSegments: number },
  skip: typeof skipToken | null
) {
  const result = sitStandApi.useGetSitStandDataInSessionQuery(
    skip ?? {
      sessionId: arg.sessionId,
      numSegments: arg.numSegments,
    }
  );

  return {
    ...result,
    data:
      result.isSuccess && result.data
        ? result.data.map((data) => new SitStandInFrame(data))
        : [],
  };
}
