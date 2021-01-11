import axios from "axios";

import SessionJSON from "./sessionPage.json";
import { AvgGradeAssignmentResponse, Session } from "./sessionPage.types";

const TEACHACTIVE_PORT = 4000;
const BASE_SERVER_URL = "http://teachactive-test.ece.iastate.edu";

export interface ISessionPageAPIHandler {
  getAllSessions(): Promise<Session[]>;
  getAverageGrades(
    courseId: number,
    startDateISO: string,
    durationDays: number
  ): Promise<AvgGradeAssignmentResponse[]>;
}

export class SessionPageAPIHandler implements ISessionPageAPIHandler {
  getAllSessions(): Promise<Session[]> {
    return Promise.resolve([]);
  }
  async getAverageGrades(
    courseId: number,
    startDateISO: string,
    durationDays: number
  ): Promise<AvgGradeAssignmentResponse[]> {
    const response = await axios.get<AvgGradeAssignmentResponse[]>(
      encodeURIComponent(
        `${BASE_SERVER_URL}:${TEACHACTIVE_PORT}/avg_grade?courseId=${courseId}&startDateISO=${startDateISO}&durationDays=${durationDays}`
      )
    );
    return response.data;
  }
}

export class SessionPageFakeAPIHandler implements ISessionPageAPIHandler {
  getAllSessions(): Promise<Session[]> {
    return Promise.resolve(
      SessionJSON.data.sessions.map(
        (session: any, i: number) => new Session(session)
      )
    );
  }
  getAverageGrades(
    courseId: number,
    startDateISO: string,
    durationDays: number
  ): Promise<AvgGradeAssignmentResponse[]> {
    return Promise.resolve([]);
  }
}
