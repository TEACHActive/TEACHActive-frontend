import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../util";
import { Response } from "api/types";
import { AttendanceStats } from "./types";

const baseEndpoint = "attendance";

export const attendanceApi = createApi({
  reducerPath: "attendance",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getAttendanceStatsForSession: builder.query<
      Response<AttendanceStats>,
      string
    >({
      query: (sessionId: string) => `${baseEndpoint}/${sessionId}`,
    }),
  }),
});

export const { useGetAttendanceStatsForSessionQuery } = attendanceApi;
