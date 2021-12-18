import { createApi, skipToken } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../util";
import { Response } from "api/types";
import { AttendanceStats } from "./types";

const baseEndpoint = "attendance";

export const attendanceApi = createApi({
  reducerPath: "attendance",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getAttendanceStatsForSession: builder.query<AttendanceStats | null, string>(
      {
        query: (sessionId: string) => `${baseEndpoint}/${sessionId}`,
        transformResponse: (response: Response<AttendanceStats>) => {
          return response.data;
        },
      }
    ),
  }),
});

export function _useGetAttendanceStatsForSessionQuery(
  sessionId: string | typeof skipToken
) {
  const result = attendanceApi.useGetAttendanceStatsForSessionQuery(sessionId);

  return {
    ...result,
    data:
      result.isSuccess && result.data ? new AttendanceStats(result.data) : null,
  };
}
