import { createApi } from "@reduxjs/toolkit/query/react";

import { User } from "./types";
import { baseQuery } from "../util";
import { Response } from "api/types";

const baseEndpoint = "user";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getUser: builder.query<Response<User>, string>({
      query: () => `${baseEndpoint}`,
    }),
  }),
});

export const { useGetUserQuery } = userApi;
