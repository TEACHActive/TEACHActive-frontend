import { createApi, skipToken } from "@reduxjs/toolkit/query/react";

import { baseQuery, getCameraFPS } from "../util";
import { Response } from "api/types";
import { AttendanceStats } from "./types";
import { Session } from "../sessions/types";

const baseEndpoint = "attendance";

export const attendanceApi = createApi({
  reducerPath: "attendance",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getAttendanceStatsForSession: builder.query<AttendanceStats | null, string>(
      {
        query: (sessionId: string) => `${baseEndpoint}/stats/${sessionId}`,
        transformResponse: (response: Response<AttendanceStats>) => {
          return response.data;
        },
      }
    ),
    getAttendanceeStatsInMultipleSessions: builder.query<
      { data: AttendanceStats; session: Session }[] | null,
      string[]
    >({
      query: (sessionIds: string[]) =>
        `${baseEndpoint}/multiple${sessionIds
          .map(
            (sessionId, i) => `${i == 0 ? "?" : "&"}sessionIds[]=${sessionId}`
          )
          .join("")}`,
      transformResponse: (
        response: Response<{ data: AttendanceStats; session: Session }[]>
      ) => {
        return response.data;
      },
    }),
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

export function _useGetAttendanceeStatsInMultipleSessionsQuery(
  sessionIds: string[] | typeof skipToken
) {
  const result = attendanceApi.useGetAttendanceeStatsInMultipleSessionsQuery(
    sessionIds
  );

  return {
    ...result,
    data:
      result.isSuccess && result.data
        ? result.data.map((val) => {
            return {
              data: new AttendanceStats(val.data),
              session: new Session(val.session, getCameraFPS()),
            };
          })
        : null,
  };
}
