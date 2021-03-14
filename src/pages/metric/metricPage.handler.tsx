import axios from "axios";
import { BASE_SERVER_URL, TEACHACTIVE_PORT } from "../../constants/api";
import { APIResponse } from "../../types/types";

import MetricJSON from "./metricPage.json";
import { AvgGradeAssignmentResponse, Session } from "./metricPage.types";

let jsonSessions = MetricJSON.data.sessions.map(
  (session: any, i: number) => new Session(session)
);

export interface IMetricPageAPIHandler {
  getAllSessions(): Promise<APIResponse<Session[]>>;
  getAverageGrades(
    courseId: number,
    startDateISO: string,
    durationDays: number
  ): Promise<APIResponse<AvgGradeAssignmentResponse[]>>;
  setSessionName(
    session: Session,
    newName: string
  ): Promise<APIResponse<Session>>;
}

export class MetricPageAPIHandler implements IMetricPageAPIHandler {
  getAllSessions(): Promise<APIResponse<Session[]>> {
    return Promise.resolve(
      new APIResponse<Session[]>({
        statusCode: 200,
        data: [],
      })
    );
  }

  async getAverageGrades(
    courseId: number,
    startDateISO: string,
    durationDays: number
  ): Promise<APIResponse<AvgGradeAssignmentResponse[]>> {
    const response = await axios.get<AvgGradeAssignmentResponse[]>(
      encodeURIComponent(
        `${BASE_SERVER_URL}:${TEACHACTIVE_PORT}/avg_grade?courseId=${courseId}&startDateISO=${startDateISO}&durationDays=${durationDays}`
      )
    );
    return Promise.resolve(
      new APIResponse<AvgGradeAssignmentResponse[]>({
        statusCode: response.status,
        data: response.data,
      })
    );
  }

  setSessionName(
    session: Session,
    newName: string
  ): Promise<APIResponse<Session>> {
    Object.assign({}, session, { name: newName });
    return Promise.resolve(
      new APIResponse<Session>({
        statusCode: 200,
        data: session,
      })
    );
  }
}

export class MetricPageFakeAPIHandler implements IMetricPageAPIHandler {
  getAllSessions(): Promise<APIResponse<Session[]>> {
    return Promise.resolve(
      new APIResponse<Session[]>({
        statusCode: 200,
        data: jsonSessions,
      })
    );
  }

  getAverageGrades(
    courseId: number,
    startDateISO: string,
    durationDays: number
  ): Promise<APIResponse<AvgGradeAssignmentResponse[]>> {
    return Promise.resolve(
      new APIResponse<AvgGradeAssignmentResponse[]>({
        statusCode: 200,
        data: [],
      })
    );
  }

  setSessionName(
    session: Session,
    newName: string
  ): Promise<APIResponse<Session>> {
    const newSessions = jsonSessions.map((jsonSession: Session) => {
      if (session.id === jsonSession.id) {
        return {
          ...jsonSession,
          name: newName,
        };
      }
      return jsonSession;
    });
    jsonSessions = newSessions;
    console.log(newSessions);

    return Promise.resolve(
      new APIResponse<Session>({
        statusCode: 200,
        data: session,
      })
    );
  }
}
