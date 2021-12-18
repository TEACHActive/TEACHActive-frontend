import { createApi } from "@reduxjs/toolkit/query/react";

import { User } from "./types";
import { baseQuery } from "../util";
import { Response } from "api/types";

const baseEndpoint = "user";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getUser: builder.query<User | null, string>({
      query: () => `${baseEndpoint}`,
      transformResponse: (response: Response<User>) => {
        return response.data;
      },
    }),
  }),
});

export function _useGetUserQuery(sessionId: string) {
  const result = userApi.useGetUserQuery(sessionId);

  return {
    ...result,
    data: result.isSuccess && result.data ? new User(result.data) : null,
  };
}
