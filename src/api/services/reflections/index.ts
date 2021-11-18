import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../util";
import { Response } from "api/types";
import { Reflection } from "./types";

const baseEndpoint = "reflections";

export const reflectionsApi = createApi({
  reducerPath: "reflections",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    // getReflectionForSessionUpsert: builder.query<Response<Reflection>, string>({
    //   query: (sessionId: string) => `${baseEndpoint}/upsert/${sessionId}`,
    // }),
    getReflectionForSessionUpsert: builder.mutation<
      Response<Reflection>,
      string
    >({
      query: (sessionId) => ({
        url: `${baseEndpoint}/upsert/${sessionId}`,
        method: "POST",
      }),
    }),
  }),
});

export const { useGetReflectionForSessionUpsertMutation } = reflectionsApi;
