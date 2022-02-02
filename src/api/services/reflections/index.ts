import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../util";

const baseEndpoint = "reflections";

export const reflectionsApi = createApi({
  reducerPath: "reflections",
  baseQuery: baseQuery,
  endpoints: (builder) => ({}),
});
