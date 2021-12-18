import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../util";
import { Reflection } from "./types";
import { MethodType, Response } from "api/types";

const baseEndpoint = "reflections";

export const reflectionsApi = createApi({
  reducerPath: "reflections",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getReflectionForSessionUpsert: builder.mutation<Reflection | null, string>({
      query: (sessionId) => ({
        url: `${baseEndpoint}/upsert/${sessionId}`,
        method: MethodType.POST,
      }),
      transformResponse: (response: Response<Reflection>) => {
        return response.data;
      },
    }),
  }),
});

export function _useGetReflectionForSessionUpsertMutation() {
  const [
    getReflectionForSessionUpsert,
    result,
  ] = reflectionsApi.useGetReflectionForSessionUpsertMutation();

  return {
    getReflectionForSessionUpsert: getReflectionForSessionUpsert,
    getReflectionForSessionResult: {
      ...result,
      data:
        result.isSuccess && result.data
          ? new Reflection(result.data)
          : undefined,
    },
  };
}
